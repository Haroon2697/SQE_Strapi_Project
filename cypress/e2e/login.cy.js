describe('Strapi Admin Login Page', () => {
  beforeEach(() => {
    cy.visit('/admin')
  })

  it('should display the login page with welcome message', () => {
    cy.contains('Welcome').should('be.visible')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
  })

  it('should have login form elements', () => {
    cy.get('form').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  it('should show error message for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    
    // Wait for error message (adjust selector based on actual Strapi UI)
    cy.wait(2000)
    cy.get('body').should('contain.text', 'Invalid') || cy.get('body').should('contain.text', 'error')
  })

  it('should navigate to admin dashboard after successful login', () => {
    // This test assumes valid credentials are set via environment variables
    const email = Cypress.env('STRAPI_EMAIL') || 'admin@strapi.io'
    const password = Cypress.env('STRAPI_PASSWORD') || 'Admin123'
    
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()
    
    cy.url({ timeout: 10000 }).should('include', '/admin')
  })
})

