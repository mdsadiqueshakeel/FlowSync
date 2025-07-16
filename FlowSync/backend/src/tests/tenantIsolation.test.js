// src/tests/tenantIsolation.test.js
const request = require("supertest");
const app = require("../app"); // ✅ this MUST be the pure express app

const Ticket = require("../models/Ticket");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("Tenant Isolation", () => {
  let tokenLogisticsAdmin;
  let ticketRetail;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const logisticsAdmin = await User.findOne({ email: "admin@logistics.com" });
    const retailUser = await User.findOne({ email: "user@retail.com" });

    tokenLogisticsAdmin = jwt.sign(
      {
        id: logisticsAdmin._id,
        role: logisticsAdmin.role,
        customerId: logisticsAdmin.customerId,
      },
      process.env.JWT_SECRET
    );

    ticketRetail = await Ticket.findOne({ customerId: "tenant-retail" });
  });

  it("should NOT allow tenant-logistics to access tenant-retail's ticket", async () => {
    const res = await request(app)
      .get("/me/tickets")
      .set("Authorization", `Bearer ${tokenLogisticsAdmin}`);

    const ids = res.body.tickets.map((t) => t._id.toString());

    expect(ids).not.toContain(ticketRetail._id.toString());
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
