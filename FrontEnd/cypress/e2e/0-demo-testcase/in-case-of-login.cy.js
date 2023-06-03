describe('Login or scatterplot', () => { 
    
    beforeEach(() => {
        cy.viewport('macbook-16')
        cy.visit('http://localhost:3000')
    })
    it('Login - incorrect email', () => {
      
        cy.get('#icon_email').type('adam.langowicz@example.com')
        cy.get('#icon_password').type('8xNup3zHgU9ZnLh')
        cy.get('.btn').click()
        cy.wait(5000)
        cy.get('#PressToShowLogout').should('not.exist')
    })
    it('Login - incorrect password', () => {
        cy.get('#icon_email').type('adam.langowicz@verii.io')
        cy.get('#icon_password').type('test')
        cy.get('.btn').click()
        cy.wait(5000)
        cy.get('#PressToShowLogout').should('not.exist')
    })
    it('Login - empty fields', () => {
        cy.get('#icon_email').type(' ')
        cy.get('#icon_password').type(' ')
        cy.get('.btn').click()
        cy.wait(5000)
        cy.get('#PressToShowLogout').should('not.exist')
    })
    it('Login - correct credential', () => {
        cy.get('#icon_email').type('adam.langowicz@verii.io')
        cy.get('#icon_password').type('8xNup3zHgU9ZnLh')
        cy.get('.btn').click()
        cy.wait(5000)
        cy.get('#PressToShowLogout').should('exist')
        cy.get('#PressToShowLogout').click()
        cy.wait(1000)
        cy.get('#logout').click()
    })

    it('Zoom in zoom out scaterplot', () => {
        cy.get('#icon_email').type('adam.langowicz@verii.io')
        cy.get('#icon_password').type('8xNup3zHgU9ZnLh')
        cy.get('.btn').click()
        cy.wait(3000)
        cy.get('canvas').trigger('mousedown', 'topRight')
        cy.get('canvas').trigger('wheel', { deltaY: 500})
        cy.wait(3000)
        cy.get('canvas').trigger('wheel', { deltaY: -500})
        cy.wait(2000)
        cy.get('#PressToShowLogout').should('exist')
        cy.get('#PressToShowLogout').click()
        cy.wait(1000)
        cy.get('#logout').click()
    })

})
