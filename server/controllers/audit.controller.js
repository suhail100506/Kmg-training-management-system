const AuditLog = require('../models/AuditLog');
const { getPaginationOptions, getPaginationMeta } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const { ROLES } = require('../config/constants');

// @desc    List audit logs (Super Admin sees all, Admin sees own only)
// @route   GET /api/v1/audit
// @access  Private (Admin + Super Admin)
const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationOptions(req.query);
    const { userId, action, module: targetModule, startDate, endDate } = req.query;

    const query = {};

    // Gating access: Admin users see their own logs only
    if (req.user.role !== ROLES.SUPER_ADMIN) {
      query.userId = req.user._id;
    } else if (userId) {
      query.userId = userId;
    }

    if (action) {
      query.action = action;
    }
    if (targetModule) {
      query.module = targetModule;
    }

    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const pagination = getPaginationMeta(total, page, limit);

    return sendSuccess(res, 'Audit logs fetched successfully', logs, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single audit log details
// @route   GET /api/v1/audit/:id
// @access  Private (Admin + Super Admin)
const getAuditLogById = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id);
    if (!log) {
      return sendError(res, 'Audit log entry not found', [], 404);
    }

    // Gate access: Admins can only view their own logs
    if (req.user.role !== ROLES.SUPER_ADMIN && log.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Access denied to view this audit log entry', [], 403);
    }

    return sendSuccess(res, 'Audit log entry fetched successfully', log);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getAuditLogById
};
