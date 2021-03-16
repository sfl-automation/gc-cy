/// <reference types="Cypress" />

context('Greencode homepage', ()=>{
  beforeEach(()=>{
    // Visit the baseUrl defined in cypress.json to avoid hardcoding within tests
    cy.visit('')
  })
  it('Checks the header functionality', ()=>{
    // Basic get elements and assertions
    cy.get('.greencode_header').should('be.visible')
    cy.get('.show_mobile').should('exist').should('not.be.visible')
    // Aliasing is useful when you are chaining and want to avoid
    // writing endless lines of selectors
    cy.get('.hide_mobile').as('desktopHeader').should('be.visible')
    cy.get('@desktopHeader').find('a').should('have.attr', 'href', "mailto:rrhh@greencodesoftware.com")
    cy.get('@desktopHeader').find('p').should('have.text', "RRHH@GREENCODESOFTWARE.COM")

    cy.get('.greencode_header-menu-brand').as('logo').should('be.visible')
    cy.get('@logo').find('a').should('have.attr', 'href', '/home')
    cy.get('@logo').find('img').as('logoImg').should('be.visible')
    cy.get('@logoImg').should('have.attr', 'src', '/assets/icons/logo_greencode-white-2d4029597e99d875b3d4db0d3babdb6f3da80397a0187c72a066e7250028e38a.svg')
    cy.get('@logoImg').should('have.attr', 'alt', 'Logo greencode white')

    // Iterating over defined data is very simple, this is overengineering of course but
    // it works like a charm
    const LINKS = [{href: '/our_work', text: 'Our approach'},{href: '/case_studies', text: 'Projects'},{href: '/our_offices', text: 'Contact'}]
    LINKS.forEach(link => {
      cy.get('.greencode_header-menu-items').find('a').contains(link.text).should('have.attr', 'href', link.href)
    })
  })
  it('Asserts all home sections are present and visible', ()=>{
    // Fixtures also allow for data to be loaded into tests quite efficiently
    // so if we add/modify a section, we just update the json and no need to touch the test
    cy.fixture('sections').then(section =>{ 
      section.sections.forEach(className => {
        cy.get(`.${className}`).should('exist').should('be.visible')
      })
    })
  })
  context('Specific section tests', ()=>{
    // Context inside context to segment tests. Notice the beforeEach() to visit the page
    // will take precedence and the beforeEach() within these blocks will run no problem as well
    // This particular one is to generate execution contexts for aliasing where it can be done only once
    // per describe/context function and aliases are still accesible
    context('Init section', ()=>{
      beforeEach(()=>{
        cy.get('.greencode_init-title').as('titleBox')
      })
      // Hardcoding text is NOT how I like to work, but for speeds sake im doing it ¯\_(ツ)_/¯ 
      it('Has a descriptive title', ()=>{
        cy.get('@titleBox').find('h2').should('have.text', "Digitizing Supply Chain & Logistics")
      })
      it('Has a link for Our Approach', ()=>{
        cy.get('@titleBox').find('a').should('have.attr', 'href', '/our_work').should('have.text', 'our approach')
      })
      // This test highlights how easy it is to access the window object. In advanced scenarios, this
      // lets me access session tokens to persist a session, or fiddle around local/session storage.
      // Not 100% sure about the promise chain, but I find it to be readable that way.
      it('Has a scroll button which triggers the page scroll downwards', ()=>{
        let initialY;
        let finalY;
        cy.window().then(win => {
          cy.log(`Initial Y = ${win.scrollY}`)
          initialY = win.scrollY;
        })
        cy.get('.mousey').click().then(()=>{
          cy.window().then(win => {
            cy.log(`Final Y = ${win.scrollY}`)
            finalY = win.scrollY;
          })
        }).then(()=>{
          expect(finalY > initialY).to.be.true;
        })
      })
    })
    context('Skills section', ()=>{
      beforeEach(()=>{
        cy.get('.greencode_skills').as('skillsSection')
      })
      // A simple validation that the Carousel will change the cards based on the user interaction with the titles in the
      // index.
      it('Should navigate through the skills carousel', ()=>{
        const SLIDES = [{title: 'Problem study', cardTitle: 'Problem study', style: '0px'}, {title: 'Product design', cardTitle: 'Product Design', style: '-100%'}, {title: 'Product development', cardTitle: 'Product Development', style: '-200%'}, {title: 'Maintenance', cardTitle: 'Evolutive and Corrective Maintenance', style: '-300%'}]
        cy.get('@skillsSection').scrollIntoView()
        SLIDES.forEach((each, index) => {
          cy.get('.greencode_skills-wrapper').find('a').contains(each.title).click()
          cy.get('.greencode_skills-slider-inner h2').eq(index).should('have.text', each.cardTitle).should('be.visible')
        })
      })
    })
    context('Jobs section', ()=>{
      it('Has an Open Positions link visible', ()=>{
        cy.get('.greencode_jobs_title').find('a').as('openPositionsLink').should('be.visible')
        cy.get('@openPositionsLink').should('have.attr', 'target', '_blank')
        cy.get('@openPositionsLink').should('have.attr', 'href', 'https://greencodesoftware.freshteam.com/jobs/search')
        cy.get('@openPositionsLink').should('have.text', 'Open positions')
      })
    })
    context('Brands info', ()=>{
      // A simple example of selectors with element attributes, in this case the alt img attribute.
      it('Loads all logos for brands that Trust us', ()=>{
        const BRANDS = ['Eucerin', 'Kraft', 'Anses', 'American Express', 'AbInvev', 'Petrobras', 'Peugeot', 'Pepsico', 'MegaTrans', 'Carrefour']
        BRANDS.forEach(brandName =>{
          cy.get(`img[alt="${brandName}"]`).should('be.visible')
        })
      })
    })
    context('Projects', ()=>{
      // Finally, a readability improvement. I'm impartial towards style, whatever works better 
      // for all involved parties is fine to me.
      it('Verifies all the project cards load', ()=>{
        cy.get('.greencode_cases_cards_item')
          .as('projectCards')
          .should('have.length', 4)

        cy.get('@projectCards')
          .eq(3)
          .as('specialCard')
          .should('have.class', 'greencode_cases_cards_item--special')

        cy.get('@specialCard').find('a')
          .should('have.class', 'proyects')
          .should('have.attr', 'href', '/case_studies')
          .should('have.text', 'Read more')
      })
    })
  })
})