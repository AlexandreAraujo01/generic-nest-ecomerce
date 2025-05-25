# generic-nest-ecomerce 

PT-BR

Um backend robusto e escalável para e-commerce, construído com [NestJS](https://nestjs.com/), usando [Prisma](https://www.prisma.io/) para ORM, com suporte a Redis para cache básico, testes unitários e E2E, e orquestrado via Docker.

---

## Tecnologias

- [NestJS](https://nestjs.com/) — Framework backend progressivo para Node.js
- [Prisma](https://www.prisma.io/) — ORM moderno para banco de dados
- [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional
- [Redis](https://redis.io/) — Cache em memória para otimização de performance(BASICO)
- [Vitest](https://vitest.dev/) — Testes unitários e de integração
- [Supertest](https://github.com/visionmedia/supertest) — Testes E2E HTTP
- [Docker](https://www.docker.com/) — Contêineres para ambiente isolado e deploy

---

## Funcionalidades

- API RESTful para gerenciamento de produtos, usuários, carrinho e pedidos
- Autenticação e autorização JWT
- Cache simples com Redis para otimizar respostas frequentes
- Banco de dados gerenciado via Prisma com migrations
- Testes unitários e testes end-to-end (E2E)
- Ambiente configurado com Docker para facilitar desenvolvimento e deploy

---

## Requisitos

- Docker e Docker Compose instalados
- Node.js v18+
- pnpm (opcional, mas recomendado)

---

## Como rodar o projeto

1. Clone o repositório

```bash
git clone https://github.com/AlexandreAraujo01/generic-nest-ecomerce.git
cd generic-nest-e-comerce

```

    Configure as variáveis de ambiente

2. Crie um arquivo .env na raiz com as variáveis descritas no arquivo .env.example


3. Rode os containers Docker (Postgres e Redis)
```
docker-compose up -d
```

4. Instale as dependências
```
pnpm install
```

5. Gere o Prisma Client e execute as migrations
```
pnpm prisma generate
pnpm prisma migrate dev
```

6. Rode a aplicação
```
pnpm start:dev
```

7. rodar testes unitarios
```
pnpm run test
```

8. rodar testes E2E
```
pnpm run test:e2e
```

9. rodar todos os testes
```
pnpm run test:all
```



   


