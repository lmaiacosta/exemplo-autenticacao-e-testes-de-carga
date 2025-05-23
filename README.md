# 🛡️ Autenticação com Keycloak + MongoDB como base de usuários

Este projeto demonstra uma arquitetura ideal onde:

- ✅ O **Keycloak** é usado **somente como provedor de autenticação** (SSO, JWT, OIDC)
- ✅ Os **dados do usuário** (preferências, perfil, etc.) ficam armazenados no **MongoDB**
- ✅ O backend usa **NestJS** e valida os tokens emitidos pelo Keycloak
- ✅ O frontend em Angular consome o fluxo de login e redirecionamento

---

## 💡 Por que essa arquitetura?

| Componente     | Função                                                                 |
|----------------|------------------------------------------------------------------------|
| 🔐 Keycloak     | Autenticação (login, logout, geração de token JWT com OIDC)           |
| 🧠 MongoDB      | Armazena os dados do usuário (username, perfil, preferências etc.)    |
| ⚙️ Backend NestJS | Valida tokens JWT e busca/gera usuários no Mongo com base no token   |
| 🌐 Frontend Angular | Simples interface de login com Keycloak                             |

---

## 🧪 Fluxo de autenticação

1. O usuário acessa o frontend e clica em “Entrar”.
2. É redirecionado ao Keycloak para login.
3. Após login, retorna com o `code` de autorização.
4. O frontend (em um próximo passo) pode trocar esse `code` por um token.
5. O backend recebe o token via `Authorization: Bearer <token>`.
6. O backend:
   - Decodifica o token.
   - Busca (ou cria) o usuário no MongoDB baseado no `preferred_username`.

---

## 📦 Serviços e portas (via Docker Compose)

| Serviço     | Porta local | Descrição                   |
|-------------|-------------|-----------------------------|
| Keycloak    | `http://localhost:1001` | Admin e login |
| Backend API | `http://localhost:1002` | NestJS         |
| Frontend    | `http://localhost:1003` | Angular App    |
| pgAdmin     | `http://localhost:1004` | Visualizador PostgreSQL |
| MongoDB     | `localhost:1005`         | Dados dos usuários |

---

## 🛠️ Rodando localmente

```bash
docker compose up --build
```

---

## ✅ Próximos passos sugeridos

- [ ] Implementar troca de `code` por `access_token` no frontend Angular
- [ ] Adicionar logout via Keycloak
- [ ] Proteger rotas específicas com `roles`
- [ ] Implementar refresh token automático

---

Feito com ❤️ para escalar autenticação de forma limpa e com baixo custo.