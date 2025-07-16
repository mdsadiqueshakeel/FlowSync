const axios = require("axios");
const Ticket = require("../models/Ticket");
const logAudit = require("../utils/logAudit");


exports.ticket = async (req, res) => {
  const { title } = req.body;

  try {
    const ticket = await Ticket.create({
      title,
      status: "Pending",
      createdBy: req.user.id,
      customerId: req.user.customerId,
    });

    await logAudit({
      action: "CREATE_TICKET",
      userId: req.user.id,
      customerId: req.user.customerId,
      metadata: { title: ticket.title },
    });

    // 🔁 Send data to n8n webhook
    await axios.post("http://n8n:5678/webhook/webhook/ticket-done", {
      ticketId: ticket._id,
      status: "Completed", // or "Pending" depending on your logic
    }, {
      headers: {
        "x-webhook-secret": process.env.N8N_SECRET,
        "Content-Type": "application/json"
      }
    });

    res.status(201).json({ ticket });
  } catch (err) {
    console.error("Ticket creation error:", err.message);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};
