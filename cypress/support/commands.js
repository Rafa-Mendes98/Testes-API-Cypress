// <reference types="cypress" />
import CryptoJS from 'crypto-js';

// Comando customizado para gerar hash MD5
Cypress.Commands.add('md5', (input) => {
  return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);
});

// Comando customizado para decodificar JWT
Cypress.Commands.add('decodeJWT', (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    throw new Error('Token JWT inválido ou indefinido');
  }
  const payload = token.split('.')[1];
  const decoded = Buffer.from(payload, 'base64').toString('utf8');
  return JSON.parse(decoded);
});

// Efetua login e armazena tokens no localStorage
Cypress.Commands.add('login', () => {
  return cy.request({
    method: 'POST',
    url: 'https://dummyjson.com/auth/login',
    body: {
      username: Cypress.env('username'),
      password: Cypress.env('password')
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const { accessToken, refreshToken } = response.body;
  return cy.window().then((win) => {
    win.localStorage.setItem('accessToken', accessToken);
    win.localStorage.setItem('refreshToken', refreshToken);
    return { accessToken, refreshToken };
  });
});
});

// Comando customizado para definir o header de autenticação
Cypress.Commands.add('setAuthHeader', (token) => {
  Cypress.env('authHeader', {
    Authorization: `Bearer ${token}`,
  });
});

// Comando customizado para logout e remoção de tokens do localStorage
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('accessToken');
    win.localStorage.removeItem('refreshToken');
  });
});

// Comando customizado para login e armazenamento de token
Cypress.Commands.add('apiLogin', () => {
  return cy.request({
    method: 'POST',
    url: '/auth/login',
    body: {
      username: Cypress.env('username'),
      password: Cypress.env('password')
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const token = response.body.accessToken;
    Cypress.env('token', token); // seta token no Cypress.env
    return token;
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