// Custom command to handle login
Cypress.Commands.add('login', (email, password) => {
  const login = () => {
    cy.session([email, password], () => {
      cy.visit('/admin', { timeout: 30000 });
      
      // Check if already logged in
      cy.get('body').then(($body) => {
        if ($body.find('input[type="email"]').length > 0) {
          // Fill out the login form
          cy.get('input[type="email"]').should('be.visible').type(email, { delay: 50 });
          cy.get('input[type="password"]').should('be.visible').type(password, { delay: 50 });
          cy.get('button[type="submit"]').should('be.visible').click();
          
          // Wait for successful login
          cy.url({ timeout: 30000 }).should('include', '/admin');
          cy.get('nav, aside', { timeout: 20000 }).should('be.visible');
        }
      });
    }, {
      validate: () => {
        // Validate the session by checking for admin elements
        cy.getCookie('strapi_jwt').should('exist');
      }
    });
  };
  
  // Attempt login with retry logic
  login();
});

describe('Strapi Admin Authentication', () => {
  const email = Cypress.env('STRAPI_EMAIL') || 'admin@strapi.io';
  const password = Cypress.env('STRAPI_PASSWORD') || 'Admin123';
  
  beforeEach(() => {
    // Clear session for tests that need to test login flow
    if (Cypress.currentTest.title.includes('login')) {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/admin/auth/logout');
    }
  });

  it('should display the login page with required elements', () => {
    cy.visit('/admin', { timeout: 30000 });
    
    // Check page title and form elements
    cy.get('h1', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Welcome');
      
    // Check form elements
    cy.get('form').should('exist').and('be.visible');
    cy.get('input[type="email"]')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'e.g. kai@strapi.io');
    cy.get('input[type="password"]')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter your password');
    cy.get('button[type="submit"]')
      .should('be.visible')
      .and('contain', 'Login')
      .and('have.attr', 'type', 'submit');
  });

  it('should show error message for invalid credentials', () => {
    cy.visit('/admin');
    
    // Test with invalid credentials
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Check for error message
    cy.get('p[role="alert"]', { timeout: 10000 })
      .should('be.visible')
      .and(($el) => {
        expect($el.text().toLowerCase()).to.match(/(invalid|error|incorrect)/i);
      });
  });

  it('should successfully log in with valid credentials', () => {
    // Use the custom login command
    cy.login(email, password);
    
    // Verify successful login by checking for dashboard elements
    cy.url().should('include', '/admin');
    cy.get('nav, aside', { timeout: 20000 })
      .should('be.visible');
    cy.get('header h1')
      .should('be.visible')
      .and('contain', 'Dashboard');
  });

  it('should maintain session after page refresh', () => {
    // First login
    cy.login(email, password);
    
    // Refresh the page
    cy.reload();
    
    // Verify still logged in
    cy.url().should('include', '/admin');
    cy.get('nav, aside').should('be.visible');
  });

  it('should log out successfully', () => {
    // First login
    cy.login(email, password);
    
    // Click on user menu and logout
    cy.get('button[aria-label="Profile"]')
      .should('be.visible')
      .click();
    cy.contains('a', 'Sign out')
      .should('be.visible')
      .click();
    
    // Verify logged out
    cy.url().should('include', '/admin/auth/login');
    cy.get('input[type="email"]').should('be.visible');
  });
});

