/// <reference types="cypress" />

describe('Criação de Produto - POST /auth/products/add', () => {
  let token;
  before(() => {
    cy.apiLogin().then(user => {
      token = Cypress.env('token');
    });
  });

  it('Deve criar produto autenticado e validar retorno', () => {
    cy.fixture('product').then(product => {
      cy.apiRequest({
        method: 'POST',
        url: '/auth/products/add',
        body: product
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.include.all.keys(
          'id', 'title', 'price', 'stock', 'rating', 'thumbnail',
          'description', 'brand', 'category'
        );
        expect(response.body.title).to.eq(product.title);
        expect(response.body.price).to.eq(product.price);
        expect(response.body.category).to.eq(product.category);
      });
    });
  });

  it('Deve falhar ao criar produto sem token', () => {
    cy.fixture('product').then(product => {
      cy.request({
        method: 'POST',
        url: '/auth/products/add',
        body: product,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 403]);
      });
    });
  });
});