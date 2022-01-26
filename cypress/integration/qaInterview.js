/// <reference types="Cypress" />
import { accounts } from '../fixtures/userAccounts'
const apiURL = "https://www.demoblaze.com/"
const timeoutValue = 10000
const emailDomain = "@dontBanMePlease.com"
const password = 'testPassword'

describe('QA Interview Test Code', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });
    it('Multiple account sign ups', () => {
        cy.writeFile('cypress/fixtures/userAccounts.json', [])
        accounts.forEach(accountContent => {
            cy.visit(apiURL);
            const emailToUse = accountContent.username + Date.now() + emailDomain;
            cy.readFile('cypress/fixtures/userAccounts.json').then((email) => {
                email.push({ email: emailToUse })
                cy.writeFile('cypress/fixtures/userAccounts.json', email)
            });
            cy.get('[data-target="#signInModal"]').click()
            cy.get('#sign-username').type(emailToUse, { force: true });
            cy.get('#sign-password', { timeout: timeoutValue }).type(password, { force: true });
            cy.get('button').contains('Sign up', { timeout: timeoutValue }).click({ force: true });
        });
    });
    it('Log in validation', () => {
        cy.visit(apiURL);
        cy.readFile('cypress/fixtures/userAccounts.json').then((email) => {
            email.forEach(item => {
                cy.get('[data-target="#logInModal"]').click()
                cy.get('#loginusername').type(item.email, { force: true });
                cy.get('#loginpassword', { timeout: timeoutValue }).type(password, { force: true });
                cy.get('[onclick="logIn()"]').click({ force: true });
                cy.get('#logout2').should('be.visible').click()

            });
        });
    })
    it('Purchase verification', () => {
        cy.visit(apiURL);
        cy.contains('Nexus').click();
        cy.contains('Add to cart').click();
        cy.get('nav').contains('Cart').click();
        cy.contains('Nexus').should('be.visible');
        cy.get('#tbodyid').find('tr').should('have.length', 1);
        cy.get('nav').contains('Home').click();
        cy.contains('Nokia').click();
        cy.contains('Add to cart').click();
        cy.get('nav').contains('Cart').click();
        cy.contains('Nokia').should('be.visible');
        cy.get('#tbodyid').find('tr').should('have.length', 2);
        cy.contains('Place Order').click();
        cy.get('#name').type('amanda');
        cy.get('#country').type('USA');
        cy.get('#city').type('New York');
        cy.get('#card').type('6666-7777-8888-9999');
        cy.get('#month').type('12');
        cy.get('#year').type('09');
        cy.get('[onClick="purchaseOrder()"]').click();
        cy.contains('Thank you for your purchase!', { timeout: timeoutValue }).should('be.visible')
    });

})