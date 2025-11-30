const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1337',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
  },
  // Use Firefox as the default browser
  browser: 'firefox',
});
