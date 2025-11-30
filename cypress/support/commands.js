// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to log in to Strapi admin
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/admin')
    
    // Check if already logged in
    cy.get('body').then(($body) => {
      if ($body.find('input[type="email"]').length > 0) {
        // Fill out the login form
        cy.get('input[type="email"]').should('be.visible').type(email, { delay: 50 })
        cy.get('input[type="password"]').should('be.visible').type(password, { delay: 50 })
        cy.get('button[type="submit"]').should('be.visible').click()
        
        // Wait for successful login
        cy.url({ timeout: 30000 }).should('include', '/admin')
        cy.get('nav, aside', { timeout: 20000 }).should('be.visible')
      }
    })
  }, {
    validate: () => {
      // Validate the session by checking for admin elements
      cy.getCookie('strapi_jwt').should('exist')
    }
  })
})

// Command to navigate to a specific section in the admin panel
Cypress.Commands.add('navigateToSection', (sectionName) => {
  // Click the menu button on mobile if it exists
  cy.get('body').then(($body) => {
    if ($body.find('button[aria-label="Toggle menu"]').length > 0) {
      cy.get('button[aria-label="Toggle menu"]').click()
    }
  })
  
  // Click the section link
  cy.contains('a, button', sectionName, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  
  // Verify the section loaded
  cy.get('main', { timeout: 20000 }).should('be.visible')
  cy.contains('h1, h2', sectionName, { timeout: 10000 }).should('be.visible')
})

// Command to create a new content type entry
Cypress.Commands.add('createEntry', (contentType, data) => {
  cy.navigateToSection('Content Manager')
  
  // Click on the content type
  cy.contains('span', contentType).click()
  
  // Click the "Create new entry" button
  cy.get('button')
    .contains('Create new entry')
    .should('be.visible')
    .click()
  
  // Fill in the form fields
  Object.entries(data).forEach(([field, value]) => {
    cy.get(`[name*="${field}"]`).type(value, { force: true })
  })
  
  // Save the entry
  cy.get('button')
    .contains('Save')
    .should('be.visible')
    .click()
    
  // Verify success message
  cy.contains('Saved', { timeout: 10000 }).should('be.visible')
})
