import CryptoJS from 'crypto-js';

// Comando customizado para gerar hash MD5
Cypress.Commands.add('md5', (input) => {
  return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);
});

Cypress.Commands.add('decodeJWT', (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    throw new Error('Token JWT inválido ou indefinido');
  }
  const payload = token.split('.')[1];
  const decoded = Buffer.from(payload, 'base64').toString('utf8');
  return JSON.parse(decoded);
});

Cypress.Commands.add('login', () => {
  return cy.fixture('user').then((user) => {
    return cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/auth/login',
      body: {
        username: user.username,
        password: user.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      const { accessToken, refreshToken } = response.body;
      window.localStorage.setItem('accessToken', accessToken);
      window.localStorage.setItem('refreshToken', refreshToken);
      return { accessToken, refreshToken };
    });
  });
});

Cypress.Commands.add('setAuthHeader', (token) => {
  Cypress.env('authHeader', {
    Authorization: `Bearer ${token}`,
  });
});

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('accessToken');
    win.localStorage.removeItem('refreshToken');
  });
});

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