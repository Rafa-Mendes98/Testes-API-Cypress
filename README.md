# Cypress API Tests – Prova Técnica

## Sobre o Projeto

Este projeto foi desenvolvido como solução para o desafio técnico de automação de testes de API com Cypress, seguindo todos os requisitos obrigatórios e diferenciais sugeridos.

## Funcionalidades testadas

1. **Verificação de Usuários**  
   Endpoint: `GET https://dummyjson.com/users`  
   - Checagem dos campos obrigatórios em cada usuário  
   - Verificação de paginação  
   - Teste de status code e contrato

2. **Autenticação de Login**  
   Endpoint: `POST https://dummyjson.com/auth/login`  
   - Login com validação dos campos obrigatórios  
   - Validação do token JWT  
   - Teste de status code e contrato

3. **Criação de Produto**  
   Endpoint: `POST https://dummyjson.com/auth/products/add`  
   - Requisição autenticada usando token  
   - Validação dos dados enviados e recebidos  
   - Teste de status code e contrato

4. **Consulta de Usuário por ID**  
   Endpoint: `GET https://dummyjson.com/users/1`  
   - Checagem de todos os campos esperados para o usuário  
   - Teste de status code, precisão e completude dos dados

## Diferenciais

- Comandos customizados para login e requisições autenticadas
- Organização em pastas e uso de fixtures
- Uso de `beforeEach` para setup
- Testes em formato BDD (`describe`/`it`)
- Exemplo de uso de `cy.intercept` simulando delay/falha
- Exemplo de relatório de testes
- Pronto para integração contínua (CI) via GitHub Actions
- Uso de variáveis de ambiente para dados sensíveis (NÃO commitados)

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/Rafa-Mendes98/Testes-API-Cypress.git
cd Testes-API-Cypress
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração de variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp cypress.env.json.example cypress.env.json
```

Edite o arquivo `cypress.env.json` com seus dados (se necessário).  
**Obs:** Não faça commit desse arquivo.

### 4. Executando os testes

- Para rodar todos os testes em modo headless:

```bash
npx cypress run
```

- Para rodar com interface gráfica:

```bash
npx cypress open
```

### 5. Gerar relatório (exemplo com mochawesome)

```bash
npx cypress run --reporter mochawesome
```

---

## Boas práticas adotadas

- **Comandos customizados:** Veja em `cypress/support/commands.js`
- **Fixtures:** Exemplos de payloads em `cypress/fixtures/`
- **Organização:** Separação por arquivos de teste para cada endpoint
- **Intercepts:** Exemplo de uso em `e2e/users.cy.js`
- **Validação de contrato:** Uso de asserções para campos obrigatórios
- **Git:** `.gitignore` robusto, sem versionamento de chaves, README completo

---

## Estrutura de pastas

```
cypress/
  e2e/
    users.cy.js
    login.cy.js
    products.cy.js
    userById.cy.js
  fixtures/
    product.json
    user.json
  support/
    commands.js
    e2e.js
.gitignore
README.md
cypress.config.js
package.json
cypress.env.json.example
.github/
  workflows/
    ci.yml
```

---

## Observações

- Nenhuma chave sensível está versionada.
- Este projeto pode ser usado em pipelines (exemplo: GitHub Actions).
- Em caso de dúvidas sobre como rodar, consulte este README.

---
