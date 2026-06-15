const mongoose = require('mongoose');
const { AUDIT_ACTIONS } = require('../config/constants');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  userEmail: {
    type: String,
    lowercase: true,
    index: true
  },
  action: {
    type: String,
    enum: [
      AUDIT_ACTIONS.CREATE,
      AUDIT_ACTIONS.UPDATE,
      AUDIT_ACTIONS.DELETE,
      AUDIT_ACTIONS.LOGIN,
      AUDIT_ACTIONS.LOGOUT,
      AUDIT_ACTIONS.EXPORT,
      AUDIT_ACTIONS.BULK_UPLOAD
    ],
    required: true,
    index: true
  },
  module: {
    type: String,
    required: true,
    index: true
  },
  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  before: {
    type: mongoose.Schema.Types.Mixed
  },
  after: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
