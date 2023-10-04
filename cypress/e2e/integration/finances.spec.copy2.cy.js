/// <reference types="cypress"/>

import { format, prepareLocalStorage } from '../../support/utils'


// cy.viewport
// arquivos de config
// configs por linha de comando


context('Dev Finances', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/#', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })
        //cy.get('#data-table > tbody > tr').should('have.length', 0) //verificar o tamanho da tabela 0 antes de executar

    });

    it('Cadastrar nova despesa', () => {
        
        cy.get('#transaction .button').click()  //id + classe
        cy.get('#description').type('Mesada')  //id
        cy.get('#amount').type(20)  //[name='amount'] atributos
        cy.get('#date').type('2023-09-20')  //[type='date'] atributos
        cy.get('button').contains('Salvar').click()  //tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3) //Outra forma de fazer o Assert com o tamanho da tabela (#data-table tbody tr)

    });

    it('Cadastrar saída de despesa', () => {
        

        cy.get('#transaction .button').click()  //id + classe
        cy.get('#description').type('Mesada')  //id
        cy.get('#amount').type(-12)  //[name='amount'] atributos
        cy.get('#date').type('2023-09-20')  //[type='date'] atributos
        cy.get('button').contains('Salvar').click()  //tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3) //Outra forma de fazer o Assert com o tamanho da tabela (#data-table tbody tr)

    });

    it('Remover ', () => {
        // const entrada = 'Total'
        // const saida = 'Banana'

        // cy.get('#transaction .button').click() 
        // cy.get('#description').type(entrada)  
        // cy.get('#amount').type(100) 
        // cy.get('#date').type('2023-09-20')  
        // cy.get('button').contains('Salvar').click() 

        // cy.get('#transaction .button').click() 
        // cy.get('#description').type(saida)  
        // cy.get('#amount').type(-35) 
        // cy.get('#date').type('2023-09-20')  
        // cy.get('button').contains('Salvar').click()

        cy.get('td.description')  //.contains(entrada)
        .contains("Mesada")
        .parent()
        .find('img[onclick*=remove]') //abrevia o seletor para remover da tabela
        .click()
        

        //estrategia 2: Buscar todos os irmaoes, e buscar oque tem img + attr
        cy.get('td.description')
        .contains("Banana")
        .siblings()
        .children('img[onclick*=remove]') //remove o elemento filho
        .click()

        cy.get('#data-table tbody tr').should('have.length', 0)
    });


    it('Validar saldo com diversas transações', () => {
        //const entrada = 'Total'
        //const saida = 'Banana'

        //cy.get('#transaction .button').click() 
        //cy.get('#description').type(entrada)  
        //cy.get('#amount').type(100) 
        //cy.get('#date').type('2023-09-20')  
        //cy.get('button').contains('Salvar').click() 

        //cy.get('#transaction .button').click() 
        //cy.get('#description').type(saida)  
        //cy.get('#amount').type(-35) 
        // cy.get('#date').type('2023-09-20')  
        // cy.get('button').contains('Salvar').click()

        let incomes = 0
        let expenses = 0

        cy.get("#data-table tbody tr")
        .each(($el, index, $list) => {
            cy.log(index)
            cy.get($el).find("td.income, td.expense")
              .invoke('text').then(text => {
                if (text.includes("-")) {
                    expenses = expenses + format(text)
                } else {
                    incomes = incomes + format(text)
                }
                cy.log(`entradas`, incomes)
                cy.log(`expenses`, expenses)
              })
        })
        cy.get('#totalDisplay').invoke('text').then(text =>{
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses
            
            expect(formattedTotalDisplay).to.eq(expectedTotal)

        })
    });
    
});
