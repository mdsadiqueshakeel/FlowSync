const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../src/models/User");
const Ticket = require("../src/models/Ticket");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Mongo connected");

  await User.deleteMany();
  await Ticket.deleteMany();

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // Seed tenants
  const logisticsAdmin = await User.create({
    email: "admin@logistics.com",
    password: adminPassword,
    role: "Admin",
    customerId: "tenant-logistics",
  });

  const logisticsUser = await User.create({
    email: "user@logistics.com",
    password: userPassword,
    role: "User",
    customerId: "tenant-logistics",
  });

  const retailAdmin = await User.create({
    email: "admin@retail.com",
    password: adminPassword,
    role: "Admin",
    customerId: "tenant-retail",
  });

  const retailUser = await User.create({
    email: "user@retail.com",
    password: userPassword,
    role: "User",
    customerId: "tenant-retail",
  });

  // Seed tickets
  await Ticket.create([
    {
      title: "Logistics ticket 1",
      customerId: "tenant-logistics",
      createdBy: logisticsUser._id,
      status: "Pending",
    },
    {
      title: "Retail ticket 1",
      customerId: "tenant-retail",
      createdBy: retailUser._id,
      status: "Pending",
    },
  ]);

  console.log("✅ Seeded 4 users and 2 tickets");
  process.exit();
};

run();
