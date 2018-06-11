describe('Home Page', () => {
  it('should find the text ANDELA and a sign in button on the home page', () => {
    // Should visit the application landing page
    cy.visit(Cypress.env('HOST_URL'));

    cy.wait(1000);

    // Should find the text "ANDELA" on the landing page
    cy.contains('ANDELA');

    // Should find the sign in button and click on it
    cy.contains('SIGN IN').click();
  });
});

