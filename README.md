---
title: "🛡️ Autenticação com Keycloak + MongoDB como base de usuários + Testes de carga"
---

## 📂 Sumário

- [🛡️ Autenticação com Keycloak + MongoDB como base de usuários](#️-autenticação-com-keycloak--mongodb-como-base-de-usuários)
  - [🚀 Cenário](#-cenário)
  - [🔑 Usuários e Senhas Padrão](#-usuários-e-senhas-padrão)
  - [💡 Por que essa arquitetura?](#-por-que-essa-arquitetura)
  - [🧪 Fluxo de autenticação integrado](#-fluxo-de-autenticação-integrado)
  - [📦 Serviços e portas (via Docker Compose)](#-serviços-e-portas-via-docker-compose)
  - [🛠️ Como rodar localmente](#️-como-rodar-localmente)
- [🧪 Testes de Carga com Locust](#-testes-de-carga-com-locust)
  - [Como executar os testes de carga](#como-executar-os-testes-de-carga)
    - [1. Keycloak](#1-keycloak)
    - [2. Backend](#2-backend)
  - [Observações](#observações)
  - [Outros](#outros)

## Requisitos

- Docker e Docker Compose instalados na máquina.
- Portas 1000 a 1006 disponíveis para uso.
- Acesso à internet para baixar as imagens do Docker.

# 🛡️ Autenticação com Keycloak + MongoDB como base de usuários

Este projeto demonstra uma arquitetura moderna onde:

- ✅ O **Keycloak** é usado **somente como provedor de autenticação** (SSO, JWT, OIDC)
- ✅ Os **dados do usuário** (preferências, perfil, etc.) ficam armazenados no **MongoDB**
- ✅ O backend usa **NestJS** e valida os tokens emitidos pelo Keycloak
- ✅ O frontend em Angular executa o fluxo completo de login, troca de token e integração com backend

---

## 🚀 Cenário

O projeto é uma aplicação de exemplo que utiliza o Keycloak como provedor de autenticação, permitindo a autenticação de usuários via OAuth2 e OIDC. O Keycloak é configurado para funcionar em conjunto com um banco de dados MongoDB, onde os dados dos usuários são armazenados. O backend, desenvolvido em NestJS, valida os tokens JWT emitidos pelo Keycloak e interage com o MongoDB para buscar ou criar usuários.

A arquitetura proposta é ideal para cenários onde já existe um banco de dados MongoDB com dados de usuários e deseja-se implementar uma solução de autenticação robusta e escalável. O Keycloak oferece recursos avançados de autenticação, como Single Sign-On (SSO), gerenciamento de sessões e suporte a múltiplos protocolos de autenticação.

A proposta é desacoplar a autenticação da aplicação principal, mantendo os dados dos usuários nas bases já existentes, sem exigir grandes refatorações no código atual. Em um cenário ideal, seria possível migrar gradualmente os dados dos usuários para o Keycloak, transformando-o em um microserviço centralizado de autenticação e gestão de usuários, sem impacto disruptivo nas aplicações.

---

## 🔑 Usuários e Senhas Padrão

- **Keycloak Admin:**
  URL: `http://localhost:1001`
  Usuário: `admin`
  Senha: `adminpass`

- **Usuário de Teste Keycloak:**
  Usuário: `testuser`
  Senha: `password`

- **MongoDB (admin/root):**
  Usuário: `admin`
  Senha: `admin`
  Banco: `mydatabase`

- **Mongo Express:**
  URL: `http://localhost:1006`
  Usuário: `admin`
  Senha: `admin`

- **pgAdmin:**
  URL: `http://localhost:1004`
  Email: `admin@admin.com`
  Senha: `adminpass`

---

## 💡 Por que essa arquitetura?

| Componente         | Função                                                                       |
| ------------------ | ---------------------------------------------------------------------------- |
| 🔐 Keycloak         | Autenticação (login, logout, geração de token JWT com OIDC)                  |
| 🧠 MongoDB          | Armazena os dados do usuário (username, perfil, preferências etc.)           |
| ⚙️ Backend NestJS   | Valida tokens JWT e busca/gera usuários no Mongo com base no token           |
| 🌐 Frontend Angular | Interface de login, troca de code por token e chamada autenticada ao backend |

---

## 🧪 Fluxo de autenticação integrado

![Fluxograma do processo de autenticação integrado](/assets/fluxo-autenticacao.png)

---

## 📦 Serviços e portas (via Docker Compose)

| Serviço       | URL/Porta                    | Descrição                  |
| ------------- | ---------------------------- | -------------------------- |
| Keycloak      | <http://localhost:1001>      | Admin e login              |
| Backend API   | <http://localhost:1002/docs> | NestJS Swagger UI          |
| Frontend      | <http://localhost:1003>      | Angular App                |
| pgAdmin       | <http://localhost:1004>      | Visualizador PostgreSQL    |
| Mongo Express | <http://localhost:1006>      | Visualizador MongoDB       |
| Instruções    | <http://localhost:1000>      | Documentação deste projeto |

---

## 🛠️ Como rodar localmente

1. Certifique-se de que as portas de 1000 a 1006 da sua máquina estejam disponíveis, para uso com o comando (*O resultado desse comando deve ser vazio*):

   ```bash
   sudo lsof -i :1000-1006 -P -n | grep LISTEN
   ```

2. Clone o repositório e suba todos os serviços:

   ```bash
   docker compose up --build -d
   ```

3. Certifique-se que os containers do projeto estão rodando:

   ```bash
   docker ps -a --filter "name=keycloak|backend|frontend|mongo-express|pgadmin|instructions" --format "table {{.Names}}\t{{.Status}}"
   ```

4. Estas instruções podem ser visualizadas na url [http://localhost:1000](http://localhost:1000).

5. Acesse o [Frontend Angular](http://localhost:1003) e clique em "Entrar".

6. Faça login no [Keycloak](http://localhost:1001) usando o usuário `testuser` e senha `password`.

7. O frontend troca o `code` por `access_token` automaticamente.

8. Ao clicar em "Chamar Backend Autenticado", o frontend envia o token para o backend.

9. O backend valida o token e busca/cria o usuário no MongoDB (com campos extras).

10. Você pode visualizar os usuários criados acessando o [Mongo Express](http://localhost:1006) (`admin`/`admin`).

11. Para testar e documentar a API, acesse o [Swagger do Backend](http://localhost:1002/docs).

---

# 🧪 Testes de Carga com Locust

Este projeto inclui testes de carga prontos para execução com [Locust](https://locust.io/) em cada serviço principal. Os arquivos `locustfile.py` estão localizados na pasta `tests` de cada serviço.

---

## Como executar os testes de carga

### 1. Keycloak

- **Arquivo de teste:** [`keycloak/tests/locustfile.py`](keycloak/tests/locustfile.py)
- **Dockerfile:** [`keycloak/tests/Dockerfile`](keycloak/tests/Dockerfile)

**Passos:**

```sh
cd keycloak/tests
docker build -t keycloak-locust .
docker run --rm -p 8089:8089 keycloak-locust --host http://localhost:1001
```

Acesse a interface web do Locust em [http://localhost:8089](http://localhost:8089) para iniciar o teste.

---

### 2. Backend

- **Arquivo de teste:** [`backend/tests/locustfile.py`](backend/tests/locustfile.py)
- **Dockerfile:** [`backend/tests/Dockerfile`](backend/tests/Dockerfile)

**Passos:**

```sh
cd backend/tests
docker build -t backend-locust .
docker run --rm -p 8090:8089 backend-locust --host http://localhost:1002
```

Acesse a interface web do Locust em [http://localhost:8090](http://localhost:8090) para iniciar o teste.

---

## Observações

- Os testes simulam múltiplos usuários acessando os principais endpoints de autenticação e API.
- É possível customizar os arquivos `locustfile.py` para simular diferentes cenários.
- Os testes podem ser executados em paralelo para diferentes serviços, basta alterar a porta mapeada do Locust (`-p ...:8089`).

---

## Outros

> 💡 **Dica:**
> A interface web do Locust permite ajustar em tempo real o número de usuários simultâneos e a taxa de requisições.
teste:** [`backend/tests/locustfile.py`](backend/tests/locustfile.py)

- **Dockerfile:** [`backend/tests/Dockerfile`](backend/tests/Dockerfile)

**Passos:**

```sh
cd backend/tests
docker build -t backend-locust .
docker run --rm -p 8090:8089 backend-locust --host http://localhost:1002
```

Acesse a interface web do Locust em [http://localhost:8090](http://localhost:8090) para iniciar o teste.
