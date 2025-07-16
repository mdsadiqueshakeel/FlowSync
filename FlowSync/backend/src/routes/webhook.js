const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const AuditLog = require("../models/AuditLogs");

// Shared secret (stored in your .env file)
const SHARED_SECRET = process.env.N8N_SECRET;

// POST /webhook/ticket-done
router.post("/ticket-done", async (req, res) => {
  const receivedSecret = req.headers["x-webhook-secret"];

  // 🔐 Validate secret
  if (!receivedSecret || receivedSecret !== SHARED_SECRET) {
    return res.status(403).json({ message: "Invalid secret" });
  }

  const { ticketId, status = "Completed" } = req.body;

  if (!ticketId) {
    return res.status(400).json({ message: "ticketId is required" });
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // ✅ Update ticket
  ticket.status = status;
  await ticket.save();

  // 🧾 Log audit
await AuditLog.create({
  action: "WEBHOOK_UPDATE",
  customerId: ticket.customerId,
  metadata: {
    ticketId,
    newStatus: status,
    via: "n8n webhook",
  },
});



  res.json({ message: "Ticket status updated via webhook" });
});

module.exports = router;
