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

/**
 * Helper function to create multiple audit log entries in a single batch.
 */
const logAuditBulk = async (logs) => {
  try {
    if (!logs || logs.length === 0) return;
    const entries = logs.map(log => ({
      userId: log.userId,
      userEmail: log.userEmail,
      action: log.action,
      module: log.module,
      recordId: log.recordId,
      before: log.before,
      after: log.after,
      ipAddress: log.ipAddress || 'unknown',
      timestamp: new Date()
    }));
    await AuditLog.insertMany(entries, { ordered: false });
  } catch (err) {
    console.error('Bulk audit log failed to write:', err);
  }
};

module.exports = { logAudit, logAuditBulk };
