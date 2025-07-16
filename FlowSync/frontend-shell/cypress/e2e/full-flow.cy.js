describe("🌪️ Full Flow Test (User + Admin)", () => {
  const userEmail = "user@retail.com";
  const userPassword = "user123";
  const adminEmail = "admin@retail.com";
  const adminPassword = "admin123";

  const createTicket = (title) => {
    cy.get("input[placeholder='Enter ticket title']").clear().type(title);
    cy.contains("Create").click();
    cy.contains(title, { timeout: 10000 }).should("exist");
  };

  const visitSupportTickets = () => {
    cy.contains("Support Tickets", { timeout: 10000 }).click();
    cy.contains("🎫 Support Tickets", { timeout: 10000 }).should("exist");
  };

  it("User login → Create ticket → Logout → Admin login → Create & Update → View Audit Logs → Dashboard → Logout", () => {
    // 1️⃣ USER LOGIN
    cy.visit("/login");
    cy.get("input[type='email']").clear().type(userEmail);
    cy.get("input[type='password']").clear().type(userPassword);
    cy.get("button[type='submit']").click();
    visitSupportTickets();

    // 2️⃣ USER CREATES TICKET
    const userTicket = `User Ticket ${Date.now()}`;
    createTicket(userTicket);

    // 3️⃣ USER LOGOUT
    cy.contains("Logout").click();
    cy.url().should("include", "/login");

    // 4️⃣ ADMIN LOGIN
    cy.get("input[type='email']").clear().type(adminEmail);
    cy.get("input[type='password']").clear().type(adminPassword);
    cy.get("button[type='submit']").click();
    visitSupportTickets();

    // 5️⃣ ADMIN CREATES TICKET
    const adminTicket = `Admin Ticket ${Date.now()}`;
    createTicket(adminTicket);

    // 6️⃣ ADMIN UPDATES A TICKET STATUS
// 6️⃣ ADMIN UPDATES A TICKET STATUS
cy.visit("dashboard/admin-dashboard");
cy.contains("📊 Admin Dashboard").should("exist");

// Give it time to load
cy.wait(1000);

// Find the ticket row by title
cy.contains(adminTicket)
  .parent()
  .find("select")
  .select("In Progress", { force: true }); // 🪄 bypasses visibility issues

// Verify change in UI
cy.contains(adminTicket)
  .parent()
  .contains("In Progress")
  .should("exist");


    // 7️⃣ AUDIT LOGS VIEW & SCROLL
    cy.visit("/dashboard/audit-log");
    cy.contains("📜 Audit Logs").should("exist");
    cy.contains("CREATE_TICKET").should("exist");

    // 8️⃣ LOGOUT
    cy.contains("Logout").click();
    cy.url().should("include", "/login");
  });
});
