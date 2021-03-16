import "cypress-intercept-formdata";

Cypress.Commands.add('submitForm', (contactName, email, phone, message)=>{
  cy.get('#contact_fullname').type(contactName)
  cy.get('#contact_email').type(email)
  cy.get('#contact_phone').type(phone)
  cy.get('#contact_message').type(message)
  cy.get('input[type="submit"]').click()
})