const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Project ID for Cypress Cloud recording
  projectId: '5vyah5',
  
  e2e: {
    baseUrl: 'http://localhost:1337',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    defaultCommandTimeout: 10000,
    video: true, // Enable video recording to see dashboard interactions
    screenshotOnRunFailure: true,
  },
  // Use Firefox as the default browser
  browser: 'firefox',
});
