const User = require('../models/User');
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../middleware/auditLogger');
const { AUDIT_ACTIONS, ROLES } = require('../config/constants');
const { getPaginationOptions, getPaginationMeta } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    List all admin users (Super Admin only)
// @route   GET /api/v1/users
// @access  Private (Super Admin)
const getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req.query);
    const { status, role, search } = req.query;

    const query = { isDeleted: false };

    if (status) {
      query.isActive = status === 'active';
    }
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { staffNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const pagination = getPaginationMeta(total, page, limit);

    return sendSuccess(res, 'Users fetched successfully', users, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new admin user (Super Admin only)
// @route   POST /api/v1/users
// @access  Private (Super Admin)
const createUser = async (req, res, next) => {
  try {
    const { staffNumber, email, role, temporaryPassword } = req.body;

    if (!staffNumber || !email || !role || !temporaryPassword) {
      return sendError(res, 'Staff Number, Email, Role, and Temporary Password are required', [], 400);
    }

    // 1. Verify staff exists in staff collection
    const staff = await Staff.findOne({ staffNumber, isDeleted: false });
    if (!staff) {
      return sendError(res, 'Staff Number does not exist in Staff Master List', [
        { field: 'staffNumber', message: 'Staff number does not exist' }
      ], 400);
    }

    // 2. Check if user already exists (active or soft-deleted)
    const existingUser = await User.findOne({
      $or: [{ staffNumber }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      if (existingUser.isDeleted) {
        // Reactivate/restore the soft-deleted user
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(temporaryPassword, salt);

        existingUser.isDeleted = false;
        existingUser.isActive = true;
        existingUser.name = staff.staffName;
        existingUser.email = email.toLowerCase();
        existingUser.role = role;
        existingUser.passwordHash = passwordHash;
        existingUser.updatedBy = req.user._id;

        await existingUser.save();

        await logAudit({
          userId: req.user._id,
          userEmail: req.user.email,
          action: AUDIT_ACTIONS.UPDATE,
          module: 'User',
          recordId: existingUser._id,
          after: {
            staffNumber,
            name: staff.staffName,
            email: email.toLowerCase(),
            role,
            isActive: true
          },
          ipAddress: req.ip
        });

        return sendSuccess(res, 'User created successfully', {
          id: existingUser._id,
          staffNumber,
          name: staff.staffName,
          email: existingUser.email,
          role
        }, null, 201);
      } else {
        return sendError(res, 'A user with this Staff Number or Email already exists', [
          { field: 'staffNumber', message: 'User already exists' }
        ], 409);
      }
    }

    // 3. Check active count limits (exactly 1 active super_admin and 6 active admins)
    if (role === ROLES.SUPER_ADMIN) {
      const activeSuperAdminCount = await User.countDocuments({
        role: ROLES.SUPER_ADMIN,
        isActive: true,
        isDeleted: false
      });
      if (activeSuperAdminCount >= 1) {
        return sendError(res, 'Limit reached: A maximum of 1 active Super Admin user is allowed in the system.', [], 400);
      }
    } else if (role === ROLES.ADMIN) {
      const activeAdminCount = await User.countDocuments({
        role: ROLES.ADMIN,
        isActive: true,
        isDeleted: false
      });
      if (activeAdminCount >= 6) {
        return sendError(res, 'Limit reached: A maximum of 6 active standard Admin users is allowed in the system.', [], 400);
      }
    }

    // Hash temporary password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(temporaryPassword, salt);

    const newUser = new User({
      staffNumber,
      name: staff.staffName,
      email: email.toLowerCase(),
      passwordHash,
      role,
      isActive: true,
      isDeleted: false,
      createdBy: req.user._id
    });

    await newUser.save();

    // Log in audit log
    await logAudit({
      userId: req.user._id,
      userEmail: req.user.email,
      action: AUDIT_ACTIONS.CREATE,
      module: 'User',
      recordId: newUser._id,
      after: {
        staffNumber,
        name: staff.staffName,
        email: email.toLowerCase(),
        role,
        isActive: true
      },
      ipAddress: req.ip
    });

    return sendSuccess(res, 'User created successfully', {
      id: newUser._id,
      staffNumber,
      name: staff.staffName,
      email: newUser.email,
      role
    }, null, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user details (Super Admin only)
// @route   GET /api/v1/users/:id
// @access  Private (Super Admin)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user || user.isDeleted) {
      return sendError(res, 'User not found', [], 404);
    }
    return sendSuccess(res, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit user details (Super Admin only)
// @route   PUT /api/v1/users/:id
// @access  Private (Super Admin)
const updateUser = async (req, res, next) => {
  try {
    const { email, role, name } = req.body;
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return sendError(res, 'User not found', [], 404);
    }

    const before = {
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Check active count limits if role is changing and user is active
    if (role && role !== user.role && user.isActive) {
      if (role === ROLES.SUPER_ADMIN) {
        const activeSuperAdminCount = await User.countDocuments({
          role: ROLES.SUPER_ADMIN,
          isActive: true,
          isDeleted: false,
          _id: { $ne: user._id }
        });
        if (activeSuperAdminCount >= 1) {
          return sendError(res, 'Limit reached: A maximum of 1 active Super Admin user is allowed in the system.', [], 400);
        }
      } else if (role === ROLES.ADMIN) {
        const activeAdminCount = await User.countDocuments({
          role: ROLES.ADMIN,
          isActive: true,
          isDeleted: false,
          _id: { $ne: user._id }
        });
        if (activeAdminCount >= 6) {
          return sendError(res, 'Limit reached: A maximum of 6 active standard Admin users is allowed in the system.', [], 400);
        }
      }
    }

    if (email) user.email = email.toLowerCase();
    if (role) user.role = role;
    if (name) user.name = name;
    user.updatedBy = req.user._id;

    await user.save();

    await logAudit({
      userId: req.user._id,
      userEmail: req.user.email,
      action: AUDIT_ACTIONS.UPDATE,
      module: 'User',
      recordId: user._id,
      before,
      after: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      ipAddress: req.ip
    });

    return sendSuccess(res, 'User updated successfully', {
      id: user._id,
      staffNumber: user.staffNumber,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate user (Super Admin only)
// @route   PATCH /api/v1/users/:id/activate
// @access  Private (Super Admin)
const activateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return sendError(res, 'User not found', [], 404);
    }

    if (user.isActive) {
      return sendError(res, 'User is already active', [], 400);
    }

    // Check active count limits before activating
    if (user.role === ROLES.SUPER_ADMIN) {
      const activeSuperAdminCount = await User.countDocuments({
        role: ROLES.SUPER_ADMIN,
        isActive: true,
        isDeleted: false
      });
      if (activeSuperAdminCount >= 1) {
        return sendError(res, 'Limit reached: A maximum of 1 active Super Admin user is allowed in the system.', [], 400);
      }
    } else if (user.role === ROLES.ADMIN) {
      const activeAdminCount = await User.countDocuments({
        role: ROLES.ADMIN,
        isActive: true,
        isDeleted: false
      });
      if (activeAdminCount >= 6) {
        return sendError(res, 'Limit reached: A maximum of 6 active standard Admin users is allowed in the system.', [], 400);
      }
    }

    user.isActive = true;
    user.updatedBy = req.user._id;
    await user.save();

    await logAudit({
      userId: req.user._id,
      userEmail: req.user.email,
      action: AUDIT_ACTIONS.UPDATE,
      module: 'User',
      recordId: user._id,
      before: { isActive: false },
      after: { isActive: true },
      ipAddress: req.ip
    });

    return sendSuccess(res, 'User activated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user (Super Admin only)
// @route   PATCH /api/v1/users/:id/deactivate
// @access  Private (Super Admin)
const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return sendError(res, 'User not found', [], 404);
    }

    if (!user.isActive) {
      return sendError(res, 'User is already inactive', [], 400);
    }

    // Cannot deactivate self
    if (user._id.toString() === req.user._id.toString()) {
      return sendError(res, 'You cannot deactivate your own account', [], 400);
    }

    user.isActive = false;
    user.updatedBy = req.user._id;
    await user.save();

    await logAudit({
      userId: req.user._id,
      userEmail: req.user.email,
      action: AUDIT_ACTIONS.UPDATE,
      module: 'User',
      recordId: user._id,
      before: { isActive: true },
      after: { isActive: false },
      ipAddress: req.ip
    });

    return sendSuccess(res, 'User deactivated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete user (Super Admin only)
// @route   DELETE /api/v1/users/:id
// @access  Private (Super Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return sendError(res, 'User not found', [], 404);
    }

    if (user._id.toString() === req.user._id.toString()) {
      return sendError(res, 'You cannot delete your own account', [], 400);
    }

    // Safety check: Prevent deletion of Super Admin
    if (user.role === ROLES.SUPER_ADMIN || user.staffNumber === 'S00001') {
      return sendError(res, 'Cannot delete the Super Admin user account. At least one Super Admin must remain in the system.', [], 400);
    }

    user.isDeleted = true;
    user.updatedBy = req.user._id;
    await user.save();

    await logAudit({
      userId: req.user._id,
      userEmail: req.user.email,
      action: AUDIT_ACTIONS.DELETE,
      module: 'User',
      recordId: user._id,
      before: { isDeleted: false },
      after: { isDeleted: true },
      ipAddress: req.ip
    });

    return sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  activateUser,
  deactivateUser,
  deleteUser
};
