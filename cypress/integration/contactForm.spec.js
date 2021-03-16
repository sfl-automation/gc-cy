/// <reference types="Cypress" />

context('Contact us Form', ()=>{
  beforeEach(()=>{
    cy.visit('/our_offices')
    cy.get('.greencode_office_form').scrollIntoView()
    cy.intercept('POST', '/contacts', {statusCode: 302, body:'Pong'}).as('formSubmit')
  })
  it('Validates the form will not submit with an incorrect email format', ()=>{
    cy.submitForm('full name', 'incorrectmail', '0303456', 'tutu turu turu tutu')
    cy.get('input:invalid').should('have.length', 1)
  })
  it('Fills in the form and submits asserting all the data was properly passed', ()=>{
    cy.submitForm('full name', 'my@email.com', '0303456', 'tutu turu turu tutu')
    cy.get('input:invalid').should('have.length', 0)
    cy.wait('@formSubmit').then(req =>{
      const DATA = decodeURI(req.request.body)
      expect(DATA).to.contain('contact[fullname]=full+name')
      expect(DATA).to.contain('contact[email]=my%40email.com')
      expect(DATA).to.contain('contact[phone]=0303456')
      expect(DATA).to.contain('contact[message]=tutu+turu+turu+tutu')
    })
  })
})

