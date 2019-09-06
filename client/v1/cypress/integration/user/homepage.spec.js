describe('The HomePage', function () {
  it('successfully loads', function () {
    cy.visit('/')
  })
  it('has logo on homepage', function () {
    cy.get('.login_container__section')
      .find('img')
      .should('have.attr', 'src')
      .should('include', 'Andela_Logo_3_jkv99w')
  })
  it('has a header text', function () {
    cy.get('.login_container__section')
      .find('p')
      .first()
      .contains('Get Closer to your social Meetup')
  })
  it('has a subheader text', function () {
    cy.get('.login_container__section')
      .find('p')
      .eq(1)
      .contains('Work hard play harder, exclusive VIP access to the best events, parties and everything FUN!!!')
  })
  describe('The Login Button', function () {
    it('has a login link', function () {
      cy.get('.login_container__btn')
        .contains('Join the creed now!')
    })
    it('has a valid redirect url', function () {
      cy.get('.login_container__btn')
        .should('have.attr', 'href')
        .should('include', `${Cypress.env('ANDELA_API_BASE_URL')}/login?redirect_url=${Cypress.env('BASE_URL')}`)
    })
  })
})
