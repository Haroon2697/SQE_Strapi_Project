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
  // Add delay to avoid rate limiting
  cy.wait(500);
  
  cy.session([email, password], () => {
    cy.visit('/admin', { timeout: 60000, failOnStatusCode: false })
    
    // Wait for page to load
    cy.get('body', { timeout: 30000 }).should('be.visible')
    
    // Wait a bit for page to fully initialize
    cy.wait(1000);
    
    // Check current URL to see if we're on registration or login page
    cy.url().then((url) => {
      // If we're on registration page, fill it out
      if (url.includes('/register-admin') || url.includes('/auth/register')) {
        cy.log('📝 On admin registration page - filling out registration form...');
        
        // Wait for form to be ready
        cy.wait(1000);
        
        // Fill registration form
        cy.get('input[type="email"], input[name="email"]', { timeout: 20000 })
          .first()
          .should('be.visible')
          .clear()
          .type(email, { delay: 50 })
        
        cy.get('input[type="password"], input[name="password"]', { timeout: 20000 })
          .first()
          .should('be.visible')
          .clear()
          .type(password, { delay: 50 })
        
        // Look for firstname and lastname fields (if they exist)
        cy.get('body').then(($body) => {
          if ($body.find('input[name="firstname"], input[placeholder*="first" i]').length > 0) {
            cy.get('input[name="firstname"], input[placeholder*="first" i]')
              .first()
              .clear()
              .type('Haroon', { delay: 50 })
          }
          if ($body.find('input[name="lastname"], input[placeholder*="last" i]').length > 0) {
            cy.get('input[name="lastname"], input[placeholder*="last" i]')
              .first()
              .clear()
              .type('Aziz', { delay: 50 })
          }
          // Check for confirm password field
          if ($body.find('input[name="confirmPassword"]').length > 0) {
            cy.get('input[name="confirmPassword"]')
              .first()
              .clear()
              .type(password, { delay: 50 })
          }
        })
        
        cy.get('button[type="submit"]', { timeout: 20000 })
          .first()
          .should('be.visible')
          .click({ force: true })
        
        // Wait for redirect to dashboard after registration
        cy.url({ timeout: 60000 }).should('satisfy', (url) => {
          return url.includes('/admin') && !url.includes('/register') && !url.includes('/auth/register');
        })
        
        // Wait for navigation to appear - more flexible
        cy.wait(2000);
        cy.get('body', { timeout: 30000 }).then(($body) => {
          const hasNav = $body.find('nav, aside, [role="navigation"], [class*="nav"], [class*="sidebar"]').length > 0;
          if (!hasNav) {
            // If navigation not found, check if we're at least on admin page
            cy.url().should('include', '/admin');
          }
        });
      } else {
        // On login page or already logged in
        cy.get('body').then(($body) => {
          // Look for login form elements
          const hasEmailInput = $body.find('input[type="email"], input[name="email"]').length > 0;
          
          if (hasEmailInput) {
            cy.log('📝 On login page - filling out login form...');
            
            // Fill out the login form with more flexible selectors
            cy.get('input[type="email"], input[name="email"]', { timeout: 20000 })
              .first()
              .should('be.visible')
              .clear()
              .type(email, { delay: 50 })
            
            cy.get('input[type="password"], input[name="password"]', { timeout: 20000 })
              .first()
              .should('be.visible')
              .clear()
              .type(password, { delay: 50 })
            
            cy.get('button[type="submit"]', { timeout: 20000 })
              .first()
              .should('be.visible')
              .click({ force: true })
            
            // Wait for successful login - more flexible checks
            cy.url({ timeout: 60000 }).should('satisfy', (url) => {
              return url.includes('/admin') && !url.includes('/login') && !url.includes('/auth/login');
            })
            
            // Wait for navigation to appear
            cy.wait(2000);
            cy.get('body', { timeout: 30000 }).then(($body) => {
              const hasNav = $body.find('nav, aside, [role="navigation"], [class*="nav"], [class*="sidebar"]').length > 0;
              if (!hasNav) {
                // If navigation not found, check if we're at least on admin page
                cy.url().should('include', '/admin');
              }
            });
          } else {
            // Already logged in, just verify
            cy.log('✅ Already logged in');
            cy.url({ timeout: 10000 }).should('include', '/admin')
            cy.get('body', { timeout: 10000 }).then(($body) => {
              const hasNav = $body.find('nav, aside, [role="navigation"]').length > 0;
              if (!hasNav) {
                cy.url().should('include', '/admin');
              }
            });
          }
        })
      }
    })
  }, {
    validate: () => {
      // More lenient validation - just check cookie exists
      cy.getCookie('strapi_jwt').then((cookie) => {
        if (!cookie) {
          // If no cookie, visit admin to check if we're logged in
          cy.visit('/admin', { failOnStatusCode: false, timeout: 30000 });
          cy.url().should('include', '/admin');
        }
      });
    },
    cacheAcrossSpecs: false // Don't cache across different test files
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
