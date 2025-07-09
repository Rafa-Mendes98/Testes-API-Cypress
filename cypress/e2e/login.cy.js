/// <reference types="cypress" />

describe('Autenticação de Login - POST /auth/login', () => {
  it('Deve autenticar, retornar status 200 e todos os campos obrigatórios', () => {
    cy.fixture('user').then(user => {
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          username: user.username,
          password: user.password
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        // Verifica se existe accessToken e refreshToken
        expect(response.body).to.have.property('accessToken');
        expect(response.body).to.have.property('refreshToken');
        // Se houver objeto user, verifica os campos dentro dele
        if (response.body.user) {
          expect(response.body.user).to.include.all.keys(
            'id', 'username', 'email', 'firstName', 'lastName',
            'gender', 'image'
          );
        }
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