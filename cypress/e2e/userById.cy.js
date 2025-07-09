/// <reference types="cypress" />

describe('Consulta de Usuário por ID - GET /users/:id', () => {
  it('Deve retornar todos os campos esperados para o usuário ID 1', () => {
    cy.request('/users/1').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include.all.keys(
        'id', 'firstName', 'lastName', 'maidenName', 'age', 'gender',
        'email', 'phone', 'username', 'password', 'birthDate', 'image',
        'bloodGroup', 'height', 'weight', 'eyeColor', 'hair', 'ip', 'address',
        'macAddress', 'university', 'bank', 'company', 'ein', 'ssn', 'userAgent',
        'crypto', 'role'
      );
      expect(response.body.id).to.eq(1);
      expect(response.body.firstName).to.be.a('string');
      expect(response.body.email).to.include('@');
      expect(['admin', 'moderator', 'user']).to.include(response.body.role);
    });
  });

  it('Deve retornar 404 para usuário inexistente', () => {
    cy.request({
      url: '/users/999999',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});