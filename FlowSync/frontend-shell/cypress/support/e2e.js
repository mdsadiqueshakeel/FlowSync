// frontend-shell/cypress/support/e2e.js

import './commands'; // 👈 this line is important to register custom commands

Cypress.on("uncaught:exception", () => false);
