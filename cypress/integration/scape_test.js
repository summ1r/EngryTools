const loginName = Cypress.env('loginName')
const loginPass = Cypress.env('loginPass')
const baseUrl = Cypress.env('baseUrl')

const radioButton = Cypress.env('radioButton')
const userName = Cypress.env('userName')
const userPass = Cypress.env('userPass')
const subButton = Cypress.env('subButton')

describe('Crawler', () => {
    it("crawls", () => {
        //console.log(Cypress.env().toString())
        cy.visit(baseUrl)
        
        cy.get(radioButton).click()
        cy.wait(500)
        cy.get(userName).children().type(loginName).should('have.value', loginName)
        cy.wait(1250)
        cy.get(userPass).children().type(loginPass)
        cy.wait(2000)
        cy.get(subButton).children().click()
        cy.wait(3000)
    })
})