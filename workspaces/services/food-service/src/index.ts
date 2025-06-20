import 'dotenv/config';

import express from 'express';
import fs from 'fs';
import path from 'path';

import { Gateway } from '@libs/gateway';

// import cors from 'cors';
import { DATABASE_URL, PORT, USER_ID } from './constants';
import { App } from './app';
import { DB } from './db';

// const CORS_ORIGIN_WHITELIST: string[] = [];

const expressServer = express();

export async function start() {
  console.log('[FOOD SERVICE] Importing actions... Start');
  await recursiveImport(path.resolve(__dirname, 'commands'));
  console.log('[FOOD SERVICE] Importing actions... Done');

  const db = new DB();

  try {
    console.log('[FOOD SERVICE] Connecting to database... Start');
    await DB.connect({ databaseUrl: DATABASE_URL });
    console.log('[FOOD SERVICE] Connecting to database... Done');
  } catch (e) {
    console.error('[FOOD SERVICE] Connecting to database... Error', e);
  }

  // FIXME what is it?
  // app.use(fileUpload());
  // app.use(cookieParser());
  // app.use(
  //   cors({
  //     credentials: true,
  //     origin: CORS_ORIGIN_WHITELIST,
  //   }),
  // );

  expressServer.use(express.json());

  expressServer.post('/command', async (req, res) => {
    try {
      res.setHeader('content-type', 'application/json');

      console.log('[FOOD SERVICE] [COMMAND]', JSON.stringify(req.body, null, 2));

      const commandType = req.body?.command;
      const command = App.findCommand(commandType);
      if (!command) {
        throw Gateway.createUnknownActionException({
          action: commandType,
        });
      }

      const requestContext = App.createCommandContext({
        db,
        userId: USER_ID,
      });

      const response = await command.handler(req.body, requestContext);

      res.status(response.status).send(response).json().end();
    } catch (error) {
      console.error('[FOOD SERVICE] [COMMAND]', error);

      if (error instanceof Gateway.Exception) {
        res.status(error.status).send(error).json().end();
      } else {
        const unknownError = Gateway.createUnknownException();

        if (error instanceof Error) {
          unknownError.message = error.message;
        }

        res.status(unknownError.status).send(unknownError).json().end();
      }
    }
  });

  // FIXME handle unknown route

  expressServer.listen(PORT, () => {
    console.log(`[FOOD SERVICE] Up and running on port ${PORT}!`);
  });
}

async function recursiveImport(dir: string) {
  const paths = fs.readdirSync(dir);

  while (paths.length) {
    const item = paths.pop();

    if (!item) {
      continue;
    }

    const currentPath = path.resolve(dir, item);
    const stat = fs.lstatSync(currentPath);

    if (stat.isDirectory()) {
      fs.readdirSync(currentPath).forEach(i => {
        paths.push(`${item}/${i}`);
      });
    } else {
      await import(currentPath).catch(() => null);
    }
  }
}

start();
