// frontend-shell/cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // 👈 or whatever your dev port is
    setupNodeEvents(on, config) {
      // implement node event listeners if needed
    },
  },
});
