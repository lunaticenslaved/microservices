import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { Database } from './src/db';

declare global {
  // eslint-disable-next-line no-var
  var psqlContainer: StartedPostgreSqlContainer | undefined;
}

beforeAll(async () => {
  const psqlContainer = await new PostgreSqlContainer('postgres:17.5-alpine')
    .withDatabase('testdb')
    .withUsername('testuser')
    .withPassword('testpass')
    .start();

  const databaseUrl = psqlContainer.getConnectionUri();
  process.env.DATABASE_URL = databaseUrl;

  await Database.connect({ databaseUrl });

  execSync(
    'npx prisma migrate dev --schema ./workspaces/services/tag-service/prisma/schema.prisma',
    { env: process.env },
  );

  globalThis.psqlContainer = psqlContainer;
}, 300_000);

// Этот скрипт запускается слишком рано и кладёт контейнер. Тесты из-за этого падают
// afterAll(async () => {
//   await globalThis.psqlContainer?.stop();
// });
