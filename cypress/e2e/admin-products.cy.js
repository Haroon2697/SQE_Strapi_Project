/**
 * Cypress E2E Tests for Saleor Admin Product Management
 */
describe('Admin Product Management', () => {
  before(() => {
    // Login as admin
    cy.visit('/admin');
    cy.get('[name="email"]').type(Cypress.env('ADMIN_EMAIL') || 'admin@example.com');
    cy.get('[name="password"]').type(Cypress.env('ADMIN_PASSWORD') || 'admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/dashboard');
  });

  it('creates a new product', () => {
    cy.visit('/admin/products');
    cy.get('[data-testid="add-product"]').click();

    cy.get('[name="name"]').type('New Test Product');
    cy.get('[name="description"]').type('Product description');
    cy.get('[name="price"]').type('99.99');
    cy.get('[name="category"]').select('Electronics');

    cy.get('[data-testid="save-product"]').click();

    cy.contains('Product created successfully', { timeout: 10000 }).should('be.visible');
    cy.contains('New Test Product').should('be.visible');
  });

  it('edits an existing product', () => {
    cy.visit('/admin/products');
    cy.get('[data-testid="product-row"]').first().click();
    cy.get('[data-testid="edit-product"]').click();

    cy.get('[name="name"]').clear().type('Updated Product Name');
    cy.get('[data-testid="save-product"]').click();

    cy.contains('Product updated successfully').should('be.visible');
  });

  it('deletes a product', () => {
    cy.visit('/admin/products');
    cy.get('[data-testid="product-row"]').first().within(() => {
      cy.get('[data-testid="delete-product"]').click();
    });
    cy.get('[data-testid="confirm-delete"]').click();

    cy.contains('Product deleted successfully').should('be.visible');
  });
});

