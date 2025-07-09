// Comando customizado para login e armazenamento de token
Cypress.Commands.add('apiLogin', () => {
  cy.fixture('user').then(user => {
    const username = Cypress.env('username') || user.username;
    const password = Cypress.env('password') || user.password;

    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: { username, password },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('accessToken');
      Cypress.env('token', response.body.accessToken);
      return response.body;
    });
  });
});

// Comando customizado para requisição autenticada
Cypress.Commands.add('apiRequest', (options) => {
  const token = Cypress.env('token');
  if (!options.headers) options.headers = {};
  options.headers['Authorization'] = `Bearer ${token}`;
  options.failOnStatusCode = false;
  return cy.request(options);
});