/// <reference types="cypress" />

describe('Autenticação de Login - POST /auth/login', () => {
  it('Deve autenticar, retornar status 201 e todos os campos obrigatórios', () => {
    cy.fixture('user').then(user => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          username: user.username,
          password: user.password
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.include.all.keys(
          'id', 'username', 'email', 'firstName', 'lastName',
          'gender', 'image', 'token'
        );
        // Opcional: validar refreshToken se a API retornar
        // expect(response.body).to.have.property('refreshToken');
        expect(response.body.token).to.match(/^[\w-]+\.[\w-]+\.[\w-]+$/); // JWT format
      });
    });
  });

  it('Deve falhar no login com senha inválida', () => {
    cy.fixture('user').then(user => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          username: user.username,
          password: 'senha_incorreta'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401]);
      });
    });
  });
});