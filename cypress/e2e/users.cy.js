/// <reference types="cypress" />

import chaiJsonSchema from 'chai-json-schema';
chai.use(chaiJsonSchema);

const userSchema = {
  type: 'object',
  required: [
    'id', 'firstName', 'lastName', 'age', 'gender',
    'email', 'username', 'birthDate', 'role'
  ],
  properties: {
    id: { type: 'number' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    age: { type: 'number' },
    gender: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' },
    birthDate: { type: 'string' },
    role: { type: 'string' }
  }
};

describe('Verificação de Usuários - GET /users', () => {
  it('CT15 - Deve retornar status 200, 30 usuários por página e todos os campos obrigatórios', () => {
    cy.request('/users').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('users');
      expect(response.body.users.length).to.be.at.most(30);
      response.body.users.forEach(user => {
        expect(user).to.be.jsonSchema(userSchema);
      });
      expect(response.body).to.have.property('total');
      expect(response.body).to.have.property('skip');
      expect(response.body).to.have.property('limit');
    });
  });

  it('CT16 - Deve validar continuidade dos dados entre páginas (paginação)', () => {
    cy.request('/users?limit=10&skip=0').then((resPage1) => {
      cy.request('/users?limit=10&skip=10').then((resPage2) => {
        const idsPage1 = resPage1.body.users.map(u => u.id);
        const idsPage2 = resPage2.body.users.map(u => u.id);
        idsPage1.forEach(id => {
          expect(idsPage2).to.not.include(id);
        });
      });
    });
  });

  it('CT17 - Deve validar valores válidos nos campos obrigatórios de cada usuário', () => {
    cy.request('/users').then((response) => {
      expect(response.status).to.eq(200);
      response.body.users.forEach(user => {
        expect(user.email).to.include('@');
        expect(user.age).to.be.greaterThan(0);
        expect(user.firstName).to.be.a('string').and.not.be.empty;
        expect(user.lastName).to.be.a('string').and.not.be.empty;
        expect(['male', 'female']).to.include(user.gender);
      });
    });
  });

  it('CT18 - Deve paginar corretamente', () => {
    cy.request('/users?limit=10&skip=10').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.users.length).to.be.at.most(10);
      expect(response.body.skip).to.eq(10);
      expect(response.body.limit).to.eq(10);
    });
  });
});