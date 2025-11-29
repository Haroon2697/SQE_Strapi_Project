// Custom command to navigate to a specific section
Cypress.Commands.add('navigateToSection', (sectionName) => {
  // Click the menu button on mobile if it exists
  cy.get('body').then(($body) => {
    if ($body.find('button[aria-label="Toggle menu"]').length > 0) {
      cy.get('button[aria-label="Toggle menu"]').click();
    }
  });
  
  // Click the section link
  cy.contains('a, button', sectionName, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true });
  
  // Verify the section loaded
  cy.get('main', { timeout: 20000 }).should('be.visible');
  cy.contains('h1, h2', sectionName, { timeout: 10000 }).should('be.visible');
});

describe('Strapi Admin Dashboard', () => {
  const email = Cypress.env('STRAPI_EMAIL') || 'admin@strapi.io';
  const password = Cypress.env('STRAPI_PASSWORD') || 'Admin123';
  
  // Common navigation items to test
  const mainNavItems = [
    'Content Manager',
    'Content-Type Builder',
    'Media Library',
    'Users',
    'Settings'
  ];

  before(() => {
    // Login once before all tests using our custom command
    cy.login(email, password);
    
    // Ensure we're on the dashboard
    cy.url().should('include', '/admin');
    cy.get('nav, aside', { timeout: 20000 }).should('be.visible');
  });

  beforeEach(() => {
    // Restore session and navigate to dashboard before each test
    Cypress.Cookies.preserveOnce('strapi_jwt');
    cy.visit('/admin', { timeout: 30000 });
    cy.get('nav, aside', { timeout: 20000 }).should('be.visible');
  });

  it('should display the admin dashboard with all required elements', () => {
    // Verify URL and main content
    cy.url().should('include', '/admin');
    
    // Check for main layout elements
    cy.get('header', { timeout: 10000 }).should('be.visible');
    cy.get('nav, aside').should('be.visible');
    cy.get('main').should('be.visible');
    
    // Check for dashboard specific content
    cy.contains('h1, h2', 'Dashboard', { timeout: 10000 })
      .should('be.visible');
    
    // Check for welcome message or recent activity
    cy.get('main')
      .should(($main) => {
        expect($main).to.contain('Welcome')
          .or.contain('Recent activity')
          .or.contain('Getting started');
      });
  });

  it('should have a functional navigation menu with all expected items', () => {
    // Check for navigation elements
    cy.get('nav, aside').should('exist').and('be.visible');
    
    // Check each navigation item
    mainNavItems.forEach(item => {
      cy.contains('a, button', item, { timeout: 5000 })
        .should('be.visible')
        .and('have.attr', 'href');
    });
  });
  
  it('should navigate to each main section successfully', () => {
    // Test navigation to each main section
    mainNavItems.forEach(section => {
      cy.navigateToSection(section);
      
      // Verify we're on the correct page
      cy.url().should('include', section.toLowerCase().replace(/\s+/g, '-'));
      
      // Go back to dashboard for next test
      cy.get('a[href="/admin"]').first().click();
      cy.get('nav, aside', { timeout: 10000 }).should('be.visible');
    });
  });

  it('should be responsive across different viewports', () => {
    // Mobile view
    cy.viewport('iphone-6');
    cy.get('button[aria-label="Toggle menu"]').should('be.visible').click();
    cy.get('nav, aside').should('be.visible');
    
    // Tablet view
    cy.viewport('ipad-2');
    cy.get('nav, aside').should('be.visible');
    
    // Desktop view
    cy.viewport(1440, 900);
    cy.get('nav, aside').should('be.visible');
  });
})

