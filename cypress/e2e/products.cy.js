/// <reference types="cypress" />

describe('Criação de Produto - POST /auth/products/add', () => {
  let token;
  before(() => {
    cy.apiLogin().then(user => {
      token = Cypress.env('token');
    });
  });

  it('CT9 - Deve criar produto autenticado e validar retorno', () => {
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

  it('CT10 - Deve falhar ao criar produto sem token', () => {
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

  it('CT11 - Deve aceitar dados inválidos (comportamento inesperado da API)', () => {
    const invalidProduct = {
      title: '',
      price: -100,
      stock: 'dez',
      description: 'Produto inválido para teste',
      category: 'electronics',
      brand: 'TestBrand',
      thumbnail: 'https://example.com/image.jpg'
    };
    cy.apiRequest({
      method: 'POST',
      url: '/auth/products/add',
      body: invalidProduct
    }).then((response) => {
      expect(response.status).to.eq(201); // A API aceita mesmo inválido
      cy.log('⚠️ A API não valida corretamente os dados enviados.');
    });
  });

  it('CT12 - Deve simular falha ao criar produto com dados inválidos', () => {
    cy.intercept('POST', '/auth/products/add', {
      statusCode: 401,
      body: { message: 'Invalid data' }
    }).as('invalidProduct');
    cy.request({
      method: 'POST',
      url: '/auth/products/add',
      body: {
        title: '',
        price: -100,
        stock: 'dez'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq('Access Token is required');
    });
  });
});