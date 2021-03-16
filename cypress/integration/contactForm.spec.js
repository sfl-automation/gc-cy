/// <reference types="Cypress" />

context('Contact us Form', ()=>{
  beforeEach(()=>{
    // Chain off the baseUrl so multi-env testing is possible without refactoring
    cy.visit('/our_offices')
    // Unnecesary, but jump to the section in case there are any fixed or absolutely 
    // positioned elements is never a bad idea
    cy.get('.greencode_office_form').scrollIntoView()
    // I sincerely hope this has not spammed your rrhh inbox, as I hadn't used intercept
    // and am familiar with .route() and .route2() methods
    cy.intercept('POST', '/contacts', {statusCode: 302, body:'Pong'}).as('formSubmit')
  })
  it('Validates the form will not submit with an incorrect email format', ()=>{
    // Use a custom command which you can find in ../support/commands.js
    cy.submitForm('full name', 'incorrectmail', '0303456', 'tutu turu turu tutu')
    // Check that the HTML validation complains the email did not match the criteria
    cy.get('input:invalid').should('have.length', 1)
  })
  it('Fills in the form and submits asserting all the data was properly passed', ()=>{
    // Again, custom command
    cy.submitForm('full name', 'my@email.com', '0303456', 'tutu turu turu tutu')
    // Should be submitted no problem
    cy.get('input:invalid').should('have.length', 0)
    // Cypress will catch the POST that is ran through the defined route in the intercept
    // method, and by grabbing the req object I can make some assertions. This is not tidy
    // but it gives you a general idea of how it works. Say we update field names in the formData
    // this test will fail.
    cy.wait('@formSubmit').then(req =>{
      const DATA = decodeURI(req.request.body)
      expect(DATA).to.contain('contact[fullname]=full+name')
      expect(DATA).to.contain('contact[email]=my%40email.com')
      expect(DATA).to.contain('contact[phone]=0303456')
      expect(DATA).to.contain('contact[message]=tutu+turu+turu+tutu')
    })
  })
})

