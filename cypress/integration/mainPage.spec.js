/// <reference types="Cypress" />

context('Greencode homepage', ()=>{
  beforeEach(()=>{
    cy.visit('')
  })
  it('Checks the header functionality', ()=>{
    cy.get('.greencode_header').should('be.visible')
    cy.get('.show_mobile').should('exist').should('not.be.visible')
    cy.get('.hide_mobile').as('desktopHeader').should('be.visible')
    cy.get('@desktopHeader').find('a').should('have.attr', 'href', "mailto:rrhh@greencodesoftware.com")
    cy.get('@desktopHeader').find('p').should('have.text', "RRHH@GREENCODESOFTWARE.COM")

    cy.get('.greencode_header-menu-brand').as('logo').should('be.visible')
    cy.get('@logo').find('a').should('have.attr', 'href', '/home')
    cy.get('@logo').find('img').as('logoImg').should('be.visible')
    cy.get('@logoImg').should('have.attr', 'src', '/assets/icons/logo_greencode-white-2d4029597e99d875b3d4db0d3babdb6f3da80397a0187c72a066e7250028e38a.svg')
    cy.get('@logoImg').should('have.attr', 'alt', 'Logo greencode white')

    const LINKS = [{href: '/our_work', text: 'Our approach'},{href: '/case_studies', text: 'Projects'},{href: '/our_offices', text: 'Contact'}]
    LINKS.forEach(link => {
      cy.get('.greencode_header-menu-items').find('a').contains(link.text).should('have.attr', 'href', link.href)
    })
  })
  it('Asserts all home sections are present and visible', ()=>{
    cy.fixture('sections').then(section =>{ 
      section.sections.forEach(className => {
        cy.get(`.${className}`).should('exist').should('be.visible')
      })
    })
  })
  context('Specific section tests', ()=>{
    context('Init section', ()=>{
      beforeEach(()=>{
        cy.get('.greencode_init-title').as('titleBox')
      })
      it('Has a descriptive title', ()=>{
        cy.get('@titleBox').find('h2').should('have.text', "Digitizing Supply Chain & Logistics")
      })
      it('Has a link for Our Approach', ()=>{
        cy.get('@titleBox').find('a').should('have.attr', 'href', '/our_work').should('have.text', 'our approach')
      })
    })
    context('Skills section', ()=>{
      beforeEach(()=>{
        cy.get('.greencode_skills').as('skillsSection')
      })
      it('Should navigate through the skills carousel', ()=>{
        const SLIDES = [{title: 'Problem study', cardTitle: 'Problem study', style: '0px'}, {title: 'Product design', cardTitle: 'Product Design', style: '-100%'}, {title: 'Product development', cardTitle: 'Product Development', style: '-200%'}, {title: 'Maintenance', cardTitle: 'Evolutive and Corrective Maintenance', style: '-300%'}]
        cy.get('@skillsSection').scrollIntoView()
        SLIDES.forEach((each, index) => {
          cy.get('.greencode_skills-wrapper').find('a').contains(each.title).click()
          cy.get('.greencode_skills-slider-inner h2').eq(index).should('have.text', each.cardTitle).should('be.visible')
        })
      })
    })
  })
})