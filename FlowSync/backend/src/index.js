require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("../src/routes/userAuth");
const adminRoutes = require("./routes/admin");
const meRoutes = require("./routes/me");
const ticketRoutes = require("./routes/tickets");

app.get("/", (req, res) => res.send("Backend API working!"));

app.use("/api/tickets", ticketRoutes);
app.use("/me", meRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

// TODO: Add /auth/login, protected routes, etc.

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
  })
  .catch((err) => console.log(err));
