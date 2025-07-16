describe("💨 Flowbit Smoke Test", () => {
  it("should login, create a ticket, and see it in the dashboard", () => {
    cy.login(); // ✅ Login

    // 🔁 Wait for the Support Tickets section to load
    cy.contains("🎫 Support Tickets", { timeout: 10000 }).should("exist");

    // 🔁 Then wait for the input field to be available
    cy.get("input[placeholder='Enter ticket title']", { timeout: 10000 }).should("exist");

    const ticketTitle = `Test Ticket ${Date.now()}`;

    // 📝 Create ticket
    cy.get("input[placeholder='Enter ticket title']")
      .clear()
      .type(ticketTitle);

    cy.contains("Create").click(); // Submit the form

    // ✅ Confirm ticket appears in list (polling)
    cy.contains(ticketTitle, { timeout: 10000 }).should("exist");

    cy.contains("Status").should("exist"); // Verify status display
  });
});
