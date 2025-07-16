const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const registry = require("../../registry.json");

const Ticket = require("../models/Ticket");
const withTenant = require("../middlewares/withTenant");

router.get("/tickets", auth(), withTenant(Ticket), async (req, res) => {
  const tickets = await req.model.find(req.queryFilter);
  res.json({ tickets });
});


router.get("/screens", auth(), (req, res) => {
  const { customerId, role } = req.user;

  const config = registry.find(r => r.tenant === customerId);
  if (!config) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  const screensForRole = config.screens?.[role]; // Get screens based on user role
  if (!Array.isArray(screensForRole)) {
    return res.status(404).json({ message: "No screens for this role" });
  }

  res.json({ screens: screensForRole });
});


module.exports = router;
