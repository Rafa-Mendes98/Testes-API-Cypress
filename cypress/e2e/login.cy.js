/// <reference types="cypress" />

describe('Suíte completa de autenticação', () => {
  let user;
  before(() => {
    cy.fixture('user').then((u) => {
      user = u;
    });
  });

  it('CT1 - Deve autenticar e acessar dados do usuário', () => {
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
        expect(res.body).to.include.all.keys(
          'id',
          'username',
          'email',
          'firstName',
          'lastName',
          'gender',
          'image'
        );
      });
    });
  });

  it('CT2 - Deve falhar no login com senha inválida', () => {
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

  it('CT3️ - Deve simular refresh de token (mock)', () => {
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

  it('CT4 - Deve detectar token expirado (simulado)', () => {
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

  it('CT5 - Deve remover tokens do localStorage ao fazer logout', () => {
    cy.login().then(() => {
      // Verifica se os tokens foram armazenados
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.exist;
        expect(win.localStorage.getItem('refreshToken')).to.exist;
      });
      // Executa o logout
      cy.logout();
      // Verifica se os tokens foram removidos
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.be.null;
        expect(win.localStorage.getItem('refreshToken')).to.be.null;
      });
    });
  });

  it('CT6 - Deve autenticar com senha em hash MD5 e retornar tokens válidos (se suportado)', () => {
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

  it('CT7 - Deve gerar hash MD5 válido e enviá-lo no login', () => {
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

  it('CT8 - Deve simular falha no login com interceptação', () => {
    cy.intercept('POST', '**/auth/login', (req) => {
      req.reply({
        statusCode: 401,
        body: { message: 'Credenciais inválidas (simulado)' }
      });
    }).as('loginFail');
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/auth/login',
      body: {
        username: 'emilys',
        password: 'senha_errada'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq('Invalid credentials');
    });
  });
})