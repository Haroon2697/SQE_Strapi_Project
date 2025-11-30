describe('Health Check', () => {
  it('should load the admin page', () => {
    cy.visit('/');
    cy.contains('Welcome to Strapi').should('be.visible');
  });
});
