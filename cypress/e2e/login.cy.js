describe('Strapi Admin Login Page', () => {
  const email = 'admin@strapi.io';
  const password = 'Admin123';
  const baseUrl = Cypress.config('baseUrl');

  beforeEach(() => {
    cy.visit('/admin', { timeout: 30000 });
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should display the login page with welcome message', () => {
    cy.get('h1', { timeout: 10000 }).should('contain', 'Welcome');
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should have login form elements', () => {
    cy.get('form').should('exist');
    cy.get('button[type="submit"]')
      .should('exist')
      .should('contain', 'Login')
      .and('be.visible');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Wait for error message with retry-ability
    cy.get('p[role="alert"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Invalid')
      .or('contain', 'error');
  });

  it('should navigate to admin dashboard after successful login', () => {
    // Login with test credentials
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    
    // Verify successful login by checking for dashboard elements
    cy.url({ timeout: 15000 }).should('include', '/admin');
    cy.get('nav', { timeout: 10000 }).should('be.visible');
  });
})

