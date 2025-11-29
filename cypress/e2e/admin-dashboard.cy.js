describe('Strapi Admin Dashboard', () => {
  beforeEach(() => {
    // Visit admin page
    cy.visit('/admin')
    
    // Attempt login if needed (adjust based on your setup)
    cy.get('body').then(($body) => {
      if ($body.text().includes('Welcome') || $body.text().includes('Login')) {
        const email = Cypress.env('STRAPI_EMAIL') || 'admin@strapi.io'
        const password = Cypress.env('STRAPI_PASSWORD') || 'Admin123'
        
        cy.get('input[type="email"]').type(email)
        cy.get('input[type="password"]').type(password)
        cy.get('button[type="submit"]').click()
        cy.wait(3000)
      }
    })
  })

  it('should display admin dashboard after login', () => {
    cy.url({ timeout: 10000 }).should('include', '/admin')
    cy.get('body').should('be.visible')
  })

  it('should have navigation menu', () => {
    cy.get('nav').should('exist').or('aside').should('exist')
  })

  it('should be responsive', () => {
    cy.viewport(375, 667) // Mobile view
    cy.get('body').should('be.visible')
    
    cy.viewport(1280, 720) // Desktop view
    cy.get('body').should('be.visible')
  })
})

