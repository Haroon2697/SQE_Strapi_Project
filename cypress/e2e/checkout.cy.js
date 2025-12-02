/**
 * Cypress E2E Tests for Saleor Checkout Flow
 */
describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes a purchase', () => {
    // Add to cart
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();

    // Go to cart
    cy.get('[data-testid="cart-icon"]').click();

    // Proceed to checkout
    cy.contains('Checkout').click();

    // Fill checkout form
    cy.get('[name="email"]').type('test@example.com');
    cy.get('[name="firstName"]').type('John');
    cy.get('[name="lastName"]').type('Doe');
    cy.get('[name="address"]').type('123 Main St');
    cy.get('[name="city"]').type('New York');
    cy.get('[name="postalCode"]').type('10001');
    cy.get('[name="country"]').select('US');

    // Complete order
    cy.contains('Place Order').click();

    // Verify success
    cy.contains('Order Confirmed', { timeout: 10000 }).should('be.visible');
  });

  it('displays cart items correctly', () => {
    // Add multiple items to cart
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.go('back');

    cy.get('[data-testid="product-card"]').eq(1).click();
    cy.get('[data-testid="add-to-cart"]').click();

    // View cart
    cy.get('[data-testid="cart-icon"]').click();

    // Verify items are displayed
    cy.get('[data-testid="cart-item"]').should('have.length.at.least', 2);
  });

  it('updates cart quantity', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-icon"]').click();

    // Increase quantity
    cy.get('[data-testid="quantity-increase"]').first().click();
    cy.get('[data-testid="cart-total"]').should('contain', '$');
  });
});

