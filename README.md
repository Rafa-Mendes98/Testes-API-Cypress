# Cypress API Tests – Prova Técnica

## Sobre o Projeto

Este projeto foi desenvolvido como solução para o desafio técnico de automação de testes de API com Cypress, seguindo todos os requisitos obrigatórios e diferenciais sugeridos.

## Funcionalidades testadas

1. **Autenticação de Login**
   Endpoint: `POST https://dummyjson.com/auth/login`
   - Login com validação dos campos obrigatórios
   - Validação do token JWT
   - Teste de status code e contrato

    √ CT1 - Deve autenticar e acessar dados do usuário
    √ CT2 - Deve falhar no login com senha inválida
    √ CT3️ - Deve simular refresh de token (mock)
    √ CT4 - Deve detectar token expirado (simulado)
    √ CT5 - Deve remover tokens do localStorage ao fazer logout
    √ CT6 - Deve autenticar com senha em hash MD5 e retornar tokens válidos (se suportado)
    √ CT7 - Deve gerar hash MD5 válido e enviá-lo no login
    √ CT8 - Deve simular falha no login com interceptação

2. **Criação de Produto**
   Endpoint: `POST https://dummyjson.com/auth/products/add`
   - Requisição autenticada usando token
   - Validação dos dados enviados e recebidos
   - Teste de status code e contrato

    √ CT9 - Deve criar produto autenticado e validar retorno
    √ CT10 - Deve falhar ao criar produto sem token
    √ CT11 - Deve aceitar dados inválidos (comportamento inesperado da API)
    √ CT12 - Deve simular falha ao criar produto com dados inválidos

3. **Consulta de Usuário por ID**
   Endpoint: `GET https://dummyjson.com/users/1`
   - Checagem de todos os campos esperados para o usuário
   - Teste de status code, precisão e completude dos dados

    √ CT13 - Deve retornar todos os campos esperados para o usuário ID 1
    √ CT14 - Deve retornar 404 para usuário inexistente

4. **Verificação de Usuários**
   Endpoint: `GET https://dummyjson.com/users`
   - Checagem dos campos obrigatórios em cada usuário
   - Verificação de paginação
   - Teste de status code e contrato

    √ CT15 - Deve retornar status 200, 30 usuários por página e todos os campos obrigatórios
    √ CT16 - Deve validar continuidade dos dados entre páginas (paginação)
    √ CT17 - Deve validar valores válidos nos campos obrigatórios de cada usuário
    √ CT18 - Deve paginar corretamente

## Diferenciais

- Comandos customizados
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

Edite o arquivo `cypress.env.json` com seus dados.
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
npm run full:report
```

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

## Observações

- Nenhuma chave sensível está versionada.
- Este projeto pode ser usado em pipelines (exemplo: GitHub Actions).
- Em caso de dúvidas sobre como rodar, consulte este README.

---

## CI:

O projeto possui CI configurado via GitHub Actions, executando os testes automaticamente a cada push ou pull request na branch main.

CI executa:
Instalação do Node e dependências
Criação dinâmica do cypress.env.json via secret
Execução dos testes com npm run full:report
Upload do relatório mochawesome como artefato

## Como configurar os secrets no GitHub
Acesse seu repositório no GitHub.
Vá em: Settings > Secrets and variables > Actions
Clique em: New repository secret
Nome: CYPRESS_ENV
Valor: {"apiBaseUrl":"https://dummyjson.com","username":"seu user","password":"sua senha"}

