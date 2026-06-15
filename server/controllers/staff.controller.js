const Staff = require('../models/Staff');
const { logAudit } = require('../middleware/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');
const { getPaginationOptions, getPaginationMeta } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    List all staff members
// @route   GET /api/v1/staff
// @access  Private (Admin + Super Admin)
const getStaff = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req.query);
    const { search, employmentStatus, groupName, designation } = req.query;

    const query = { isDeleted: false };

    if (employmentStatus) {
      query.employmentStatus = employmentStatus;
    }
    if (groupName) {
      query.groupName = groupName;
    }
    if (designation) {
      query.designation = designation;
    }

    if (search) {
      query.$or = [
        { staffName: { $regex: search, $options: 'i' } },
        { staffNumber: { $regex: search, $options: 'i' } },
        { emailId: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Staff.countDocuments(query);
    const staff = await Staff.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const pagination = getPaginationMeta(total, page, limit);

    return sendSuccess(res, 'Staff members fetched successfully', staff, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new staff member
// @route   POST /api/v1/staff
// @access  Private (Admin + Super Admin)
const createStaff = async (req, res, next) => {
  try {
    const {
      staffNumber,
      staffName,
      emailId,
      designation,
      groupName,
      productDivisionCategory,
      reportingGLManagerName,
      employmentStatus,
      dateOfJoining,
      superannuationDate
    } = req.body;

    if (!staffNumber || !staffName || !employmentStatus) {
      return sendError(res, 'Staff Number, Staff Name, and Employment Status are required', [], 400);
    }

    // Check unique staff number
    const existingStaff = await Staff.findOne({ staffNumber, isDeleted: false });
    if (existingStaff) {
      return sendError(res, `Staff member with number ${staffNumber} already exists`, [
        { field: 'staffNumber', message: 'Staff number already exists' }
      ], 409);
    }

    const newStaff = new Staff({
      staffNumber,
      staffName,
      emailId: emailId ? emailId.toLowerCase() : undefined,
      designation,
      groupName,
      productDivisionCategory,
      reportingGLManagerName,
      employmentStatus,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
      superannuationDate: superannuationDate ? new Date(superannuationDate) : undefined,
      createdBy: req.user._id
    });

    await newStaff.save();

    await logAudit({
      userId: req.user._id,
      userEmail: req.user.email,
      action: AUDIT_ACTIONS.CREATE,
      module: 'Staff',
      recordId: newStaff._id,
      after: newStaff.toObject(),
      ipAddress: req.ip
    });

    return sendSuccess(res, 'Staff member created successfully', newStaff, null, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single staff member details
// @route   GET /api/v1/staff/:id
// @access  Private (Admin + Super Admin)
const getStaffById = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff || staff.isDeleted) {
      return sendError(res, 'Staff member not found', [], 404);
    }
    return sendSuccess(res, 'Staff member fetched successfully', staff);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit staff member details
// @route   PUT /api/v1/staff/:id
// @access  Private (Admin + Super Admin)
const updateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff || staff.isDeleted) {
      return sendError(res, 'Staff member not found', [], 404);
    }

    const before = staff.toObject();

    const updates = req.body;
    
    // Update fields
    const fieldsToUpdate = [
      'staffName',
      'emailId',
      'designation',
      'groupName',
      'productDivisionCategory',
      'reportingGLManagerName',
      'employmentStatus',
      'dateOfJoining',
      'superannuationDate'
    ];

    fieldsToUpdate.forEach(field => {
      if (updates[field] !== undefined) {
        if (field === 'emailId') {
          staff[field] = updates[field] ? updates[field].toLowerCase() : undefined;
        } else if (field === 'dateOfJoining' || field === 'superannuationDate') {
          staff[field] = updates[field] ? new Date(updates[field]) : undefined;
        } else {
          staff[field] = updates[field];
        }
      }
    });

    staff.updatedBy = req.user._id;
    await staff.save();

    await logAudit({
      userId: req.user._id,
      userEmail: req.user.email,
      action: AUDIT_ACTIONS.UPDATE,
      module: 'Staff',
      recordId: staff._id,
      before,
      after: staff.toObject(),
      ipAddress: req.ip
    });

    return sendSuccess(res, 'Staff member updated successfully', staff);
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete staff member
// @route   DELETE /api/v1/staff/:id
// @access  Private (Admin + Super Admin)
const deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff || staff.isDeleted) {
      return sendError(res, 'Staff member not found', [], 404);
    }

    const before = staff.toObject();

    staff.isDeleted = true;
    staff.updatedBy = req.user._id;
    await staff.save();

    await logAudit({
      userId: req.user._id,
      userEmail: req.user.email,
      action: AUDIT_ACTIONS.DELETE,
      module: 'Staff',
      recordId: staff._id,
      before,
      after: staff.toObject(),
      ipAddress: req.ip
    });

    return sendSuccess(res, 'Staff member deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Autocomplete search staff by name or number
// @route   GET /api/v1/staff/search
// @access  Private (Admin + Super Admin)
const searchStaff = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return sendSuccess(res, 'Empty query', []);
    }

    const regex = new RegExp(q, 'i');
    const staff = await Staff.find({
      isDeleted: false,
      $or: [
        { staffNumber: regex },
        { staffName: regex }
      ]
    })
    .limit(10)
    .lean();

    return sendSuccess(res, 'Search completed successfully', staff);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStaff,
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  searchStaff
};
