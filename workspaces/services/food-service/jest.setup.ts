import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { DB } from './src/db';

dotenv.config({ path: './.env.test' });

declare global {
  // eslint-disable-next-line no-var
  var psqlContainer: StartedPostgreSqlContainer | undefined;
}

beforeAll(async () => {
  const psqlContainer = await new PostgreSqlContainer('postgres:17.5-alpine')
    .withDatabase('testdb')
    .withUsername('testuser')
    .withPassword('testpass')
    .withReuse()
    .start();

  const DATABASE_URL = psqlContainer.getConnectionUri();
  process.env.DATABASE_URL = DATABASE_URL;

  await DB.connect({
    databaseUrl: DATABASE_URL,
  });

  execSync(
    'npx prisma migrate reset -f --schema ./workspaces/services/food-service/prisma/schema.prisma',
    { env: process.env },
  );

  execSync(
    'npx prisma migrate deploy --schema ./workspaces/services/food-service/prisma/schema.prisma',
    {
      env: process.env,
    },
  );

  globalThis.psqlContainer = psqlContainer;
}, 300_000);

// Этот скрипт запускается слишком рано и кладёт контейнер. Тесты из-за этого падают
// afterAll(async () => {
//   await globalThis.psqlContainer?.stop();
// });
