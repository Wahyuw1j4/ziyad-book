# Ziyad API

Run the project using Docker Compose (Postgres + Node app).

## Prerequisites
- Docker & Docker Compose (v2) installed

## Quick start
1. Build and start services (runs the app in development mode):

```bash
docker compose up --build -d
```

2. Install deps + generate Prisma client and push schema to the DB (execute inside the `app` service):

```bash
# runs inside the app container
docker compose exec app sh -c "npm install --silent && npx prisma generate && npx prisma db push"
```

Notes:
- `npx prisma generate` creates the Prisma client used by the app.
- `npx prisma db push` syncs the Prisma schema with the database (dev workflows). If you use migrations, run `npx prisma migrate dev` instead.

## Access
- App: http://localhost:3000
- Postgres (host): localhost:5432 (user: `postgres`, pass: `postgres`, db: `ziyad`)

## Common commands
- View logs:

```bash
docker compose logs -f app
```

- Stop & remove containers (and network):

```bash
docker compose down
```

- Run a shell inside the app container:

```bash
docker compose exec app sh
```

## Tips
- If you change the Prisma schema, re-run `npx prisma generate` and `npx prisma db push` (or `migrate` as appropriate).
- For production builds, replace the `app` service command with a proper Dockerfile build and non-mounted `node_modules`.
