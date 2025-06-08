import 'dotenv/config';

import express, { Express } from 'express';
import path from 'path';

// import cors from 'cors';
import { prisma } from './prisma';
import { Action } from './app';
import { recursiveImport } from './utils/common';

// const CORS_ORIGIN_WHITELIST: string[] = [];
const PORT = Number(process.env.PORT__FOOD_SERVICE);

export async function configureApp(app: Express) {
  console.log('Importing actions... Start');
  await recursiveImport(path.resolve(__dirname, 'actions'));
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

  app.use(express.json());

  app.post('/act', async (req, res) => {
    try {
      res.setHeader('content-type', 'application/json');

      const actionType = req.body?.action;
      const action = Action.find(actionType);
      if (!action) {
        throw Action.Error.createUnknownActionError({
          action: actionType,
        });
      }

      const validationResult = action.validator.safeParse(req.body);
      if (validationResult.error) {
        throw Action.Error.createValidationError({
          issues: validationResult.error.issues,
        });
      }

      const requestContext: Action.IContext = {
        prisma: prisma,
      };

      const actionResponse = await action.handler(validationResult.data, requestContext);

      res.status(actionResponse.status).send(actionResponse).json().end();
    } catch (error) {
      if (error instanceof Action.Error) {
        res.status(error.status).send(error).json().end();
      } else {
        const unknownError = Action.Error.createUnknownError();

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

configureApp(express());
