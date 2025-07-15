const express = require("express");
const Ticket = require("../models/Ticket");

exports.ticket = async (req, res) => {
  const { title } = req.body;

  try {
    const ticket = await Ticket.create({
      title,
      status: "Pending",
      createdBy: req.user.id,
      customerId: req.user.customerId,
    });

    res.status(201).json({ ticket });
  } catch (err) {
    console.error("Ticket creation error:", err.message);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};