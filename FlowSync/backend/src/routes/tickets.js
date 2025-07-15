const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {ticket} = require("../controllers/ticket");

const Ticket = require("../models/Ticket");

router.post("/", auth(),ticket);

module.exports = router;
