import 'dotenv/config';

import express, { Express } from 'express';

// import cors from 'cors';
import { App } from './app';
import { prisma } from './prisma';

import fs from 'fs';
import path from 'path';
import { Gateway } from '@libs/gateway';
import { randomUUID } from 'crypto';

// const CORS_ORIGIN_WHITELIST: string[] = [];
const PORT = Number(process.env.PORT);

export async function configureApp(app: Express) {
  console.log('Importing actions... Start');
  await recursiveImport(path.resolve(__dirname, 'commands'));
  console.log('Importing actions... Done');

  try {
    console.log('Connecting to database... Start');
    await prisma.$connect();
    console.log('Connecting to database... Done');
  } catch (e) {
    console.error('Connecting to database... Error', e);
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

  App.express.use(express.json());

  App.express.post('/command', async (req, res) => {
    try {
      res.setHeader('content-type', 'application/json');

      const actionType = req.body?.action;
      const action = App.findCommand(actionType);
      if (!action) {
        throw Gateway.createUnknownActionException({
          action: actionType,
        });
      }

      const validationResult = action.validator.safeParse(req.body);
      if (validationResult.error) {
        throw Gateway.createRequestValidationException({
          issues: validationResult.error.issues,
        });
      }

      const requestContext: App.ICommandContext = {
        prisma: prisma,
        userId: randomUUID(), // TODO not random uuid
      };

      const actionResponse = await action.handler(validationResult.data, requestContext);

      res.status(actionResponse.status).send(actionResponse).json().end();
    } catch (error) {
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

  app.listen(PORT, () => {
    console.log(`Food service is up and running on port ${PORT}!`);
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

configureApp(express());
