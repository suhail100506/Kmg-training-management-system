const AuditLog = require('../models/AuditLog');

/**
 * Helper function to create an audit log entry.
 */
const logAudit = async ({
  userId,
  userEmail,
  action,
  module,
  recordId,
  before,
  after,
  ipAddress
}) => {
  try {
    await AuditLog.create({
      userId,
      userEmail,
      action,
      module,
      recordId,
      before,
      after,
      ipAddress: ipAddress || 'unknown',
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Audit log failed to write:', err);
  }
};

module.exports = { logAudit };
