// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// ************// ***********************************************
// This support file contains global setup and teardown
// that runs before and after your tests.
// ***********************************************

// Import commands.js
import './commands';

// Global before hook - runs once before all tests
before(() => {
  // Set up any global test data or state here
  cy.log('Running global setup');
});

// Before each test
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies();
  cy.clearLocalStorage();
  
  // Reset the database state if needed
  // cy.exec('npm run db:reset');
  
  // Set a consistent viewport for all tests
  cy.viewport(1280, 800);
});

// After each test
afterEach(() => {
  // Take a screenshot on test failure
  if (Cypress.currentTest.state === 'failed') {
    const specName = Cypress.spec.name.replace('.cy.js', '');
    const testName = Cypress.currentTest.title;
    const screenshotName = `${specName} -- ${testName} (failed).png`;
    
    // Take screenshot
    cy.screenshot(screenshotName, { capture: 'runner' });
  }
});

// After all tests
after(() => {
  // Clean up any test data or state here
  cy.log('Running global teardown');
});
