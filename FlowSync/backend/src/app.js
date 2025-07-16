require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/userAuth");
const adminRoutes = require("./routes/admin");
const meRoutes = require("./routes/me");
const ticketRoutes = require("./routes/tickets");
const webhookRoutes = require("./routes/webhook");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend API working!"));

app.use("/webhook", webhookRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/me", meRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

module.exports = app;
