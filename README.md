# Sister Sorting – Backend

Express.js REST API for the Social/Sister Sorting app. Uses PostgreSQL (Neon or any Postgres) and Drizzle ORM. Containerized with Docker for consistent local runs.

## Tech Stack

- **Backend:** Node.js + Express
- **DB:** PostgreSQL (Neon-friendly)
- **ORM/Migrations:** Drizzle
- **Containers:** Docker + Docker Compose

## Prerequisites

- **Docker Desktop** (includes Compose)

**URL:** `http://localhost:5001`

## Dev with Docker Compose (hot reload)

to start:
```bash
docker compose up --build
# in another terminal (optional)
curl http://localhost:5001/api/health
```
to stop:
```bash
docker compose down
```
## Prod-style (run the built image)

to start:
```bash
# build the production image
docker build -t sister-backend:prod -f backend/Dockerfile backend

# run it (detached) with your env file
docker run -d --name sister-backend -p 5001:5001 --env-file backend/.env sister-backend:prod

# health check
curl http://localhost:5001/api/health

```
view logs / stop:
```bash
docker logs -f sister-backend
docker stop sister-backend && docker rm sister-backend
```

## Run Locally (no Docker)

```bash
cd backend
npm i
cp .env.example .env   # fill values
npm run dev
curl http://localhost:5001/api/health
```

## Migrations (Drizzle)

```bash
# with Docker
docker compose exec backend npx drizzle-kit migrate

# or locally
cd backend && npx drizzle-kit migrate
```

## Useful

```bash
docker compose logs -f backend
docker compose down
```

## Env Example (`backend/.env.example`)

```env
PORT=5001
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
JWT_SECRET=replace-me
```

## Notes

- Don’t commit secrets (`backend/.env` is gitignored).
- If port 5001 is busy: change compose to `ports: ["5002:5001"]` or free it:
  ```bash
  lsof -ti tcp:5001 | xargs kill -9
  ```
- Ensure server binds to `0.0.0.0` in Docker.
