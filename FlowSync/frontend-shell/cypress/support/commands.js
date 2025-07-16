// cypress/support/commands.js

Cypress.Commands.add("login", () => {
  cy.visit("/login");
  cy.get("input[type='email']").clear().type("admin@retail.com"); // 🔥 clear before typing
  cy.get("input[type='password']").clear().type("admin123");
  cy.get("button[type='submit']").click();
});
