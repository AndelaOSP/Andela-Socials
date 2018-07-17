describe('Login Page', () => {
  it('should find the ANDELA logo and a login button on the Login page', () => {
    // Should visit the application login page
    cy.visit(Cypress.env('HOST_URL'));

    cy.wait(1000);

    // Should find the andela logo image
    cy.get('img');

    // Should find the text "Get Closer to your social Meetup" on the login page
    cy.contains('Get Closer to your social Meetup');

    // Should find the login button
    cy.get('.login_container__btn');
  });
});
