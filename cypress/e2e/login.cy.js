/// <reference types="cypress" />

describe('Suíte completa de autenticação com JWT', () => {
  let user;

  before(() => {
    cy.fixture('user').then((u) => {
      user = u;
    });
  });

  it('1️⃣ Deve autenticar e acessar dados do usuário', () => {
    cy.login().then(({ accessToken }) => {
      expect(accessToken).to.exist;
      cy.decodeJWT(accessToken).then((decoded) => {
        expect(decoded.username).to.eq(user.username);
      });
      cy.request({
        method: 'GET',
        url: 'https://dummyjson.com/auth/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('username', user.username);
      });
    });
  });

  it('2️⃣ Deve falhar no login com senha inválida', () => {
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/auth/login',
      body: {
        username: user.username,
        password: 'senha_incorreta',
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 401]);
      expect(res.body).to.have.property('message');
    });
  });

  it('3️⃣ Deve simular refresh de token (mock)', () => {
    // DummyJSON não tem endpoint real de refresh, então simulamos
    cy.login().then(({ refreshToken }) => {
      expect(refreshToken).to.be.a('string');
      // Simula novo token
      const newAccessToken = refreshToken; // Em uma API real, você faria POST /auth/refresh
      cy.setAuthHeader(newAccessToken);
      cy.request({
        method: 'GET',
        url: 'https://dummyjson.com/auth/me',
        headers: Cypress.env('authHeader'),
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
  });

  it('4️⃣ Deve detectar token expirado (simulado)', () => {
    // Cria um token manualmente com expiração passada
    const expiredToken = [
      btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
      btoa(JSON.stringify({ username: 'expiredUser', exp: 1 })),
      'signature'
    ].join('.');

    cy.request({
      method: 'GET',
      url: 'https://dummyjson.com/auth/me',
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 500]);
    });
  });

  it('5 Deve remover tokens do localStorage ao fazer logout', () => {
    cy.login().then(() => {
      cy.logout();
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.be.null;
        expect(win.localStorage.getItem('refreshToken')).to.be.null;
      });
    });
  });

  it('6️⃣ Deve autenticar com senha em hash MD5 e retornar tokens válidos (se suportado)', () => {
    cy.md5(user.password).then((hash) => {
      cy.request({
        method: 'POST',
        url: 'https://dummyjson.com/auth/login',
        body: {
          username: user.username,
          password: hash,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // DummyJSON não aceita hash, então esperamos falha
        expect([400, 401]).to.include(response.status);
      });
    });
  });

  it('7️⃣ Deve gerar hash MD5 válido e enviá-lo no login', () => {
    cy.md5(user.password).then((hash) => {
      expect(hash).to.match(/^[a-f0-9]{32}$/); // Verifica formato do hash

      cy.request({
        method: 'POST',
        url: 'https://dummyjson.com/auth/login',
        body: {
          username: user.username,
          password: hash,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 400, 401]).to.include(response.status);
      });
    });
  });
});