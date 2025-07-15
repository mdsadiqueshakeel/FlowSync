const AuditLog = require("../models/AuditLogs");

const logAudit = async ({ action, userId, customerId, metadata = {} }) => {
  try {
    await AuditLog.create({
      action,
      userId,
      customerId,
      metadata,
    });
  } catch (err) {
    console.error("❌ Failed to log audit event:", err.message);
  }
};

module.exports = logAudit;
