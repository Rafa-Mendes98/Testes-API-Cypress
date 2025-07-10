/// <reference types="cypress" />

describe('Consulta de Usuário por ID - GET /users/:id', () => {
  it('CT13 - Deve retornar todos os campos esperados para o usuário ID 1', () => {
    cy.request('/users/1').then((response) => {
      expect(response.status).to.eq(200);
      // Validação de campos principais
      expect(response.body).to.include.all.keys(
        'id', 'firstName', 'lastName', 'maidenName', 'age', 'gender',
        'email', 'phone', 'username', 'password', 'birthDate', 'image',
        'bloodGroup', 'height', 'weight', 'eyeColor', 'hair', 'ip', 'address',
        'macAddress', 'university', 'bank', 'company', 'ein', 'ssn', 'userAgent',
        'crypto', 'role'
      );
      // Validações de tipo e conteúdo
      expect(response.body.id).to.eq(1);
      expect(response.body.firstName).to.be.a('string');
      expect(response.body.email).to.include('@');
      expect(response.body.birthDate).to.match(/^\d{4}-\d{1,2}-\d{1,2}$/);
      expect(response.body.macAddress).to.match(/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i);
      expect(['admin', 'moderator', 'user']).to.include(response.body.role);
      // Validação de objetos aninhados
      expect(response.body.address).to.have.all.keys(
        'address', 'city', 'state', 'stateCode', 'postalCode', 'coordinates', 'country'
      );
      expect(response.body.address.coordinates).to.have.all.keys('lat', 'lng');
      expect(response.body.bank).to.have.all.keys(
        'cardExpire', 'cardNumber', 'cardType', 'currency', 'iban'
      );
      expect(response.body.company).to.have.property('name');
      expect(response.body.company.address).to.have.all.keys(
        'address', 'city', 'state', 'stateCode', 'postalCode', 'coordinates', 'country'
      );
      expect(response.body.crypto).to.have.all.keys('coin', 'wallet', 'network');
    });
  });

  it('CT14 - Deve retornar 404 para usuário inexistente', () => {
    cy.request({
      url: '/users/999999',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
