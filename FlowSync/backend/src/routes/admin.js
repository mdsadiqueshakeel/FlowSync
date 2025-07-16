const router = require("express").Router();
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const permit = require("../middlewares/permit");
const logAudit = require("../utils/logAudit");
const AuditLog = require("../models/AuditLogs");

// src/routes/admin.js
router.get("/dashboard", auth(), permit("Admin"), async (req, res) => {
  const { customerId } = req.user;

  const tickets = await Ticket.find({ customerId })
    .sort({ createdAt: -1 })
    .populate("createdBy", "email");

  const total = tickets.length;
  const pending = tickets.filter(t => t.status === "Pending").length;
  const inProgress = tickets.filter(t => t.status === "In Progress").length;
  const completed = tickets.filter(t => t.status === "Completed").length;

  res.json({
    total,
    pending,
    inProgress,
    completed,
    tickets
  });
});


// src/routes/admin.js
// src/routes/admin.js

router.patch("/tickets/:id", auth(), permit("Admin"), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // ✅ Match with model
  if (!["Pending", "In Progress", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  ticket.status = status;
  await logAudit({
  action: "UPDATE_STATUS",
  userId: req.user.id,
  customerId: req.user.customerId,
  metadata: { ticketId: ticket._id, newStatus: ticket.status },
});

  await ticket.save();

  res.json({ message: "Status updated", ticket });
});

router.get("/audit-logs", auth(), permit("Admin"), async (req, res) => {
  const logs = await AuditLog.find({ customerId: req.user.customerId })
    .sort({ createdAt: -1 })
    .populate("userId", "email")
    .limit(100);
  res.json({ logs });
});



module.exports = router;
