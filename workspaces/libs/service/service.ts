import z from 'zod/v4';

import { Gateway } from '@libs/gateway';
import path from 'path';
import fs from 'fs';
import express from 'express';

import { ServiceConfig } from './types';

const USER_ID = '23800be6-0aca-4d35-8ba6-8daa70e53ea2';

// import cors from 'cors';
// const CORS_ORIGIN_WHITELIST: string[] = [];

type Command = `${Gateway.Services}/${string}`;

type CommandConfig<
  TReq extends Gateway.IRequest<Command, unknown>,
  TRes extends Gateway.IResponse<unknown>,
  TErr extends Gateway.IException<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ICommandContext,
> = {
  validator: z.ZodType<TReq['data']>;
  handler: (data: TReq, context: ICommandContext) => Promise<TRes | TErr>;
  command: TReq['command'];
};

export class Service<TConfig extends ServiceConfig, TCommandContext> {
  started = false;

  config: TConfig;

  constructor(arg: { config: TConfig }) {
    this.config = arg.config;
  }

  private commands: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

  addCommand<
    TReq extends Gateway.IRequest<Command, unknown>,
    TRes extends Gateway.IResponse<unknown>,
    TErr extends Gateway.Exception<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  >(
    command: TReq['command'],
    arg: Omit<CommandConfig<TReq, TRes, TErr, TCommandContext>, 'command'>,
  ) {
    this.commands[command] = {
      ...arg,
      command,
    };

    return this.commands[command] as CommandConfig<TReq, TRes, TErr, TCommandContext>;
  }

  findCommand(action: string):
    | CommandConfig<
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        Gateway.IResponse<unknown>,
        Gateway.IException<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
        TCommandContext
      >
    | undefined {
    return this.commands[action];
  }

  async start(arg: {
    port: number;
    commandsDirPath: string;
    connectDb: () => Promise<void>;
    createCommandContext: (arg: {
      serviceConfig: TConfig;
      user: { id: string };
    }) => TCommandContext;
  }) {
    const serviceTitle = `${this.config.service.toUpperCase()} SERVICE`;

    // Import commands
    console.log(`[${serviceTitle}] Importing actions... Start`);
    await recursiveImport(arg.commandsDirPath);
    console.log(`[${serviceTitle}] Importing actions... Done`);

    // Connect database
    try {
      console.log(`[${serviceTitle}] Connecting to database... Start`);
      await arg.connectDb();
      console.log(`[${serviceTitle}] Connecting to database... Done`);
    } catch (e) {
      console.error(`[${serviceTitle}] Connecting to database... Error`, e);
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

    const expressServer = express();

    // Parse body
    expressServer.use(express.json());

    // Add command endpoint
    expressServer.post('/command', async (req, res) => {
      try {
        res.setHeader('content-type', 'application/json');

        console.log(`[${serviceTitle}] [COMMAND]`, req.body);

        const commandType = req.body?.command;
        const command = this.findCommand(commandType);
        if (!command) {
          throw Gateway.createUnknownCommandException({
            action: commandType,
          });
        }

        const requestContext = arg.createCommandContext({
          serviceConfig: this.config,
          user: {
            id: USER_ID,
          },
        });

        const requestValidated = Gateway.RequestSchema.safeParse(req.body);
        if (!requestValidated.success) {
          throw Gateway.createRequestValidationException({
            issues: requestValidated.error.issues,
          });
        }

        const commandValidator = command.validator.safeParse(requestValidated.data.data);
        if (commandValidator.error) {
          throw Gateway.createRequestValidationException({
            issues: commandValidator.error.issues,
          });
        }

        const response = await command.handler(req.body, requestContext);

        res.status(response.status).send(response).json().end();
      } catch (error) {
        console.error(`[${serviceTitle}] [COMMAND]`, error);

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

    const { port } = arg;

    expressServer.listen(port, () => {
      this.started = true;
      console.log(`[${serviceTitle}] Up and running on port ${port}!`);
    });
  }
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
