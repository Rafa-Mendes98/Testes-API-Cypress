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
  it('Deve retornar status 200, 30 usuários por página e todos os campos obrigatórios', () => {
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

  it('Deve paginar corretamente', () => {
    cy.request('/users?limit=10&skip=10').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.users.length).to.be.at.most(10);
      expect(response.body.skip).to.eq(10);
      expect(response.body.limit).to.eq(10);
    });
  });
});