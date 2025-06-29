- `useNx` set to `true` to use auto loading env files

DEBUG=testcontainers* - in npm test script to debug testcontainers

# First time setup

mkdir postgres-data  # Create the directory first
docker-compose up -d postgres
sudo chown -R 999:999 postgres-data  # 999 is usually Postgres' user in container

# How to connect to postgres container with psql
psql -h localhost -p 6432 -U user -d tag

# Push schema to DB
```
SERVICE=<service>

DATABASE_URL=postgres://user:password@localhost:6432/$SERVICE \
    npx prisma db push \
    --schema workspaces/services/$SERVICE-service/prisma/schema.prisma

```
