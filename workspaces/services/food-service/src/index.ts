import 'dotenv/config';

import path from 'path';

import { App } from '#/app';
import { Database } from '#/db';

App.start({
  port: Number(process.env.PORT), // TODO Check in app
  commandsDirPath: path.resolve(__dirname, 'commands'),
  createCommandContext: arg => ({
    ...arg,
  }),
  connectDb: async () =>
    Database.connect({
      databaseUrl: process.env.DATABASE_URL || '',
    }),
});
