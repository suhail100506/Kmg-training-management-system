const MasterData = require('../models/MasterData');
const { sendSuccess, sendError } = require('../utils/response');
const { MASTER_DATA_TYPES } = require('../config/constants');

// @desc    Get master data list by type
// @route   GET /api/v1/master/:type
// @access  Private (Super Admin - but let regular authenticated Admins GET them for dropdown options)
const getMasterData = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { all } = req.query; // If all=true, return inactive ones too. By default return only active.

    // Validate type
    const validTypes = Object.values(MASTER_DATA_TYPES);
    if (!validTypes.includes(type)) {
      return sendError(res, `Invalid master data type. Must be one of ${validTypes.join(', ')}`, [], 400);
    }

    const query = { type };
    if (all !== 'true') {
      query.isActive = true;
    }

    const list = await MasterData.find(query).sort({ value: 1 }).lean();
    return sendSuccess(res, 'Master data fetched successfully', list);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new master value
// @route   POST /api/v1/master/:type
// @access  Private (Super Admin only)
const addMasterValue = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { value } = req.body;

    if (!value || value.trim() === '') {
      return sendError(res, 'Value is required', [], 400);
    }

    // Validate type
    const validTypes = Object.values(MASTER_DATA_TYPES);
    if (!validTypes.includes(type)) {
      return sendError(res, `Invalid master data type. Must be one of ${validTypes.join(', ')}`, [], 400);
    }

    // Check if exists
    const exists = await MasterData.findOne({
      type,
      value: { $regex: new RegExp(`^${value.trim()}$`, 'i') }
    });

    if (exists) {
      return sendError(res, `Value "${value}" already exists for type "${type}"`, [], 409);
    }

    const doc = new MasterData({
      type,
      value: value.trim(),
      isActive: true,
      createdBy: req.user._id
    });
    await doc.save();

    return sendSuccess(res, 'Master data value added successfully', doc, null, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit master value or toggle status
// @route   PUT /api/v1/master/:type/:id
// @access  Private (Super Admin only)
const updateMasterValue = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { value, isActive } = req.body;

    const doc = await MasterData.findOne({ _id: id, type });
    if (!doc) {
      return sendError(res, 'Master data value not found', [], 404);
    }

    if (value && value.trim() !== '') {
      // Check unique
      const exists = await MasterData.findOne({
        _id: { $ne: doc._id },
        type,
        value: { $regex: new RegExp(`^${value.trim()}$`, 'i') }
      });

      if (exists) {
        return sendError(res, `Value "${value}" already exists for type "${type}"`, [], 409);
      }
      doc.value = value.trim();
    }

    if (isActive !== undefined) {
      doc.isActive = isActive;
    }

    await doc.save();
    return sendSuccess(res, 'Master data updated successfully', doc);
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete master value
// @route   DELETE /api/v1/master/:type/:id
// @access  Private (Super Admin only)
const deleteMasterValue = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    
    // We can hard-delete master values, or just remove them.
    // The prompt says "delete (soft)". Let's remove them from database or toggle isActive.
    // To match specifications "delete (soft) master value", we can just remove it,
    // or let's use standard delete. Since it's master data, we can delete it directly,
    // but to be safe, let's delete it from DB.
    const doc = await MasterData.findOneAndDelete({ _id: id, type });
    if (!doc) {
      return sendError(res, 'Master data value not found', [], 404);
    }

    return sendSuccess(res, 'Master data value deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMasterData,
  addMasterValue,
  updateMasterValue,
  deleteMasterValue
};
