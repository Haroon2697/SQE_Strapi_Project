describe('Strapi Admin Dashboard', () => {
  const email = 'admin@strapi.io';
  const password = 'Admin123';
  const baseUrl = Cypress.config('baseUrl');

  before(() => {
    // Login once before all tests
    cy.visit('/admin', { timeout: 30000 });
    
    // Only login if not already logged in
    cy.get('body').then(($body) => {
      if ($body.find('input[type="email"]').length > 0) {
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button[type="submit"]').click();
        
        // Wait for dashboard to load
        cy.url({ timeout: 15000 }).should('include', '/admin');
        cy.get('nav, aside', { timeout: 10000 }).should('be.visible');
      }
    });
  });

  beforeEach(() => {
    // Ensure we're on the dashboard before each test
    cy.visit('/admin', { timeout: 30000 });
    cy.get('nav, aside', { timeout: 10000 }).should('be.visible');
  });

  it('should display admin dashboard after login', () => {
    // Verify URL and main content
    cy.url().should('include', '/admin');
    cy.get('main', { timeout: 10000 }).should('be.visible');
    
    // Check for dashboard content
    cy.contains('h1, h2', 'Dashboard').should('be.visible');
  });

  it('should have navigation menu with expected items', () => {
    // Check for navigation elements
    cy.get('nav, aside').should('exist').and('be.visible');
    
    // Check for common navigation items
    const menuItems = ['Content Manager', 'Content-Type Builder', 'Media Library'];
    menuItems.forEach(item => {
      cy.contains('a, button', item, { timeout: 5000 }).should('be.visible');
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

