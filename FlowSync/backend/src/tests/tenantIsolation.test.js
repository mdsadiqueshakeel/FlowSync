const request = require("supertest");
const app = require("../index");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("Tenant Isolation", () => {
  let tokenLogisticsAdmin;
  let ticketRetail;

  beforeAll(async () => {
    // Connect DB if not already
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // Find users
    const logisticsAdmin = await User.findOne({ email: "admin@logistics.com" });
    const retailUser = await User.findOne({ email: "user@retail.com" });

    // JWT for logistics admin
    tokenLogisticsAdmin = jwt.sign(
      {
        id: logisticsAdmin._id,
        role: logisticsAdmin.role,
        customerId: logisticsAdmin.customerId,
      },
      process.env.JWT_SECRET
    );

    // Get retail ticket created by seed
    ticketRetail = await Ticket.findOne({ customerId: "tenant-retail" });
  });

  it("should NOT allow tenant-logistics to access tenant-retail's ticket", async () => {
    const res = await request(app)
      .get("/me/tickets") // Make sure this route uses withTenant()
      .set("Authorization", `Bearer ${tokenLogisticsAdmin}`);

    // Check that logistics admin does NOT see retail ticket
    const ids = res.body.tickets.map((t) => t._id.toString());

    expect(ids).not.toContain(ticketRetail._id.toString());
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
