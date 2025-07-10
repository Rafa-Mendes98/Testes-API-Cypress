# 🚀 Cypress API Tests – Prova Técnica

---

## 📋 Sobre o Projeto

Este repositório contém a solução para o desafio técnico de **automação de testes de API** utilizando **Cypress**, implementando todos os requisitos obrigatórios e diferenciais propostos.

---

## 🎯 Funcionalidades Testadas

### 1. 🔐 Autenticação de Login  
**Endpoint:** `POST https://dummyjson.com/auth/login`  
Testes realizados:  
- Validação dos campos obrigatórios no login  
- Verificação e decodificação do token JWT  
- Testes de status code e contrato  

| Teste | Descrição                                           | Status |
|-------|----------------------------------------------------|--------|
| CT1   | Autenticar e acessar dados do usuário              | ✅      |
| CT2   | Falha no login com senha inválida                   | ✅      |
| CT3   | Simulação de refresh token (mock)                   | ✅      |
| CT4   | Detectar token expirado (simulado)                  | ✅      |
| CT5   | Remover tokens do localStorage ao fazer logout      | ✅      |
| CT6   | Autenticar com senha em hash MD5 e validar tokens   | ✅      |
| CT7   | Gerar hash MD5 válido e enviar no login             | ✅      |
| CT8   | Simular falha no login com interceptação            | ✅      |

---

### 2. 🛒 Criação de Produto  
**Endpoint:** `POST https://dummyjson.com/auth/products/add`  
Testes realizados:  
- Requisição autenticada com token  
- Validação dos dados enviados e recebidos  
- Teste de status code e contrato  

| Teste | Descrição                                    | Status |
|-------|---------------------------------------------|--------|
| CT9   | Criar produto autenticado e validar retorno | ✅      |
| CT10  | Falhar ao criar produto sem token            | ✅      |
| CT11  | Aceitar dados inválidos (comportamento API)  | ✅      |
| CT12  | Simular falha na criação com dados inválidos | ✅      |

---

### 3. 👤 Consulta de Usuário por ID  
**Endpoint:** `GET https://dummyjson.com/users/1`  
Testes realizados:  
- Verificação dos campos esperados no usuário  
- Teste de status code e completude dos dados  

| Teste | Descrição                                  | Status |
|-------|-------------------------------------------|--------|
| CT13  | Retornar todos os campos para usuário ID 1 | ✅      |
| CT14  | Retornar 404 para usuário inexistente       | ✅      |

---

### 4. 📋 Verificação de Usuários  
**Endpoint:** `GET https://dummyjson.com/users`  
Testes realizados:  
- Validação dos campos obrigatórios em cada usuário  
- Verificação de paginação e continuidade dos dados  
- Testes de status code e contrato  

| Teste | Descrição                                             | Status |
|-------|------------------------------------------------------|--------|
| CT15  | Retornar status 200 e 30 usuários por página          | ✅      |
| CT16  | Validar continuidade dos dados entre páginas          | ✅      |
| CT17  | Validar valores válidos nos campos obrigatórios       | ✅      |
| CT18  | Paginar corretamente                                   | ✅      |

---

## 💡 Diferenciais

- Comandos customizados para reuso e organização  
- Estrutura modular com pastas e uso de fixtures  
- Setup com `beforeEach` para garantir testes independentes  
- Testes escritos no formato BDD (`describe`/`it`) para melhor legibilidade  
- Uso de `cy.intercept` para simular delays e falhas de rede  
- Geração de relatórios detalhados com mochawesome  
- Preparado para integração contínua (CI) com GitHub Actions  
- Gerenciamento de dados sensíveis via variáveis de ambiente (não versionadas)  

---

## ⚙️ Como Rodar Localmente

### 1. Clone o repositório  
```bash
git clone https://github.com/Rafa-Mendes98/Testes-API-Cypress.git
cd Testes-API-Cypress
```

### 2. Instale as dependências  
```bash
npm install
```

### 3. Configure as variáveis de ambiente  
Copie o arquivo de exemplo e edite seus dados:  
```bash
cp cypress.env.json.example cypress.env.json
```
> **Importante:** Não faça commit do arquivo `cypress.env.json` para manter dados seguros.

### 4. Execute os testes  
- Modo headless (terminal):  
```bash
npx cypress run
```
- Modo interface gráfica (GUI):  
```bash
npx cypress open
```

### 5. Gere o relatório completo (mochawesome)  
```bash
npm run full:report
```

---

## 📁 Estrutura do Projeto

```
cypress/
 ├─ e2e/
 │   ├─ login.cy.js
 │   ├─ products.cy.js
 │   ├─ userById.cy.js
 │   └─ users.cy.js
 ├─ fixtures/
 │   └─ product.json
 └─ support/
     ├─ commands.js
     └─ e2e.js
.github/
 └─ workflows/
     └─ ci.yml
.gitignore
README.md
cypress.config.js
package.json
cypress.env.json.example
```

---

## ⚠️ Observações

- Nenhuma chave sensível está versionada no repositório  
- Projeto pronto para rodar em pipelines CI (exemplo: GitHub Actions)  
- Para dúvidas, consulte este README ou abra uma issue

---

## 🤖 Integração Contínua (CI)

O projeto possui CI configurado via GitHub Actions que executa automaticamente os testes a cada push ou pull request na branch `main`.

Fluxo do CI:  
- Instalação do Node e dependências  
- Criação dinâmica do arquivo `cypress.env.json` via secret  
- Execução dos testes com `npm run full:report`  
- Upload do relatório mochawesome como artefato para análise  

---

## 🔐 Como Configurar Secrets no GitHub

1. Acesse o repositório no GitHub  
2. Vá em: **Settings > Secrets and variables > Actions**  
3. Clique em **New repository secret**  
4. Configure:  
   - **Name:** `CYPRESS_ENV`  
   - **Value:**  
```json
{"apiBaseUrl":"https://dummyjson.com","username":"seu_user","password":"sua_senha"}
```
