import { App } from './app';
import { Database } from './db';

import path from 'path';

App.start({
  port: 3000,
  commandsDirPath: path.resolve(__dirname, 'commands'),
  createCommandContext: () => ({}),
  connectDb: async () =>
    Database.connect({
      databaseUrl: process.env.DATABASE_URL || '',
    }),
});
