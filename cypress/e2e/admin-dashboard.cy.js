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
  const email = Cypress.env('CYPRESS_ADMIN_EMAIL') || Cypress.env('STRAPI_EMAIL') || 'i222697@nu.edu.pk';
  const password = Cypress.env('CYPRESS_ADMIN_PASSWORD') || Cypress.env('STRAPI_PASSWORD') || '@Haroon5295';
  
  // Common navigation items to test
  const mainNavItems = [
    'Content Manager',
    'Content-Type Builder',
    'Media Library',
    'Users',
    'Settings'
  ];

  before(() => {
    // Wait to avoid rate limiting
    cy.wait(2000);
    
    // Login once before all tests using our custom command
    cy.login(email, password);
    
    // Ensure we're on the dashboard
    cy.url({ timeout: 30000 }).should('include', '/admin').and('not.include', '/login');
    cy.get('nav, aside, [role="navigation"], [class*="nav"]', { timeout: 20000 }).should('be.visible');
  });

  beforeEach(() => {
    // Restore session and navigate to dashboard before each test
    Cypress.Cookies.preserveOnce('strapi_jwt');
    cy.visit('/admin', { timeout: 30000 });
    cy.get('nav, aside', { timeout: 20000 }).should('be.visible');
  });

  it('should display the admin dashboard with all required elements', () => {
    // Verify URL and main content
    cy.url({ timeout: 10000 }).should('include', '/admin').and('not.include', '/login');
    
    // Check for main layout elements - more flexible
    cy.get('header, [role="banner"], [class*="header"]', { timeout: 10000 }).should('be.visible');
    cy.get('nav, aside, [role="navigation"], [class*="nav"], [class*="sidebar"]', { timeout: 10000 }).should('be.visible');
    cy.get('main, [role="main"], [class*="main"], [class*="content"]', { timeout: 10000 }).should('be.visible');
    
    // Check for dashboard specific content - more flexible
    cy.get('body', { timeout: 10000 }).then(($body) => {
      // Check for any heading
      const hasHeading = $body.find('h1, h2, [class*="title"], [class*="heading"]').length > 0;
      expect(hasHeading).to.be.true;
    });
    
    // Check for welcome message or recent activity - more flexible
    cy.get('main, [role="main"], [class*="main"]', { timeout: 10000 })
      .should(($main) => {
        const text = $main.text().toLowerCase();
        expect(text).to.match(/(welcome|dashboard|recent|activity|getting started)/i);
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
});
