import z from 'zod/v4';

import path from 'path';
import fs from 'fs';
import express from 'express';
import jwt from 'jsonwebtoken';

import {
  Exception,
  RequestValidationException,
  UnknownCommandException,
  UnknownException,
  ICommandRequest,
  ServiceCommandConfig,
  ExtractCommandContract,
  NonGatewayAccessException,
} from '@libs/gateway';

import { AppEnv, AppConfig } from './types';

// import cors from 'cors';
// const CORS_ORIGIN_WHITELIST: string[] = [];
const GATEWAY_TOKEN_HEADER = 'x-gateway-token';

interface IHandlerSuccessResponse<T extends ServiceCommandConfig['command']> {
  success: true;
  status: number;
  data: ExtractCommandContract<T>['response']['data'];
}

type ApplicationCommandConfig<T extends ServiceCommandConfig['command'], TContext> = {
  command: T;
  validator: z.ZodType<ExtractCommandContract<T>['request']['data']>;
  handler: (
    request: ICommandRequest<ExtractCommandContract<T>>,
    context: TContext,
  ) => Promise<IHandlerSuccessResponse<T> | ExtractCommandContract<T>['exceptions']>;
};

type ApplicationConstructor<TConfig> = {
  localConfig: TConfig;
  config: {
    env: AppEnv;
    service: string;
    jwtGatewaySecret: string;
  };
};

export class Application<TConfig, TCommandContext> {
  started = false;

  localConfig: TConfig;
  config: AppConfig;

  constructor(arg: ApplicationConstructor<TConfig>) {
    this.config = arg.config;
    this.localConfig = arg.localConfig;
  }

  private commands: Record<
    string,
    ApplicationCommandConfig<ServiceCommandConfig['command'], TCommandContext>
  > = {};

  addCommand<T extends ServiceCommandConfig['command']>(
    config: ApplicationCommandConfig<T, TCommandContext>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.commands[config.command] = config as any;

    return config;
  }

  private _findCommandConfigOrThrow(command: string) {
    const commandConfig = this.commands[command] as unknown as
      | ApplicationCommandConfig<ServiceCommandConfig['command'], TCommandContext>
      | undefined;

    if (!commandConfig) {
      throw new UnknownCommandException({ command: command });
    }

    return commandConfig;
  }

  async start(arg: {
    port: number;
    commandsDirPath: string;
    connectDb: () => Promise<void>;
    createCommandContext: (arg: {
      app: Application<TConfig, TCommandContext>;
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

    // TODO what is it?
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

        console.log(`[${serviceTitle}] [COMMAND] Checking gateway access...`);
        const jwtGatewayToken = String(req.headers[GATEWAY_TOKEN_HEADER]);
        const decoded = jwt.verify(jwtGatewayToken, this.config.jwtGatewaySecret);
        if (typeof decoded !== 'object' || decoded.iss !== 'api-gateway') {
          throw new NonGatewayAccessException();
        }

        console.log(`[${serviceTitle}] [COMMAND]`, req.body);

        const requestContext = arg.createCommandContext({ app: this });

        console.log(`[${serviceTitle}] [COMMAND] Config found`);
        const commandConfig = this._findCommandConfigOrThrow(req.body?.command);

        // Если Gateway пропустил сюда, то структура запроса уже валидна
        const commandRequest = req.body as ICommandRequest<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        const { error } = commandConfig.validator.safeParse(commandRequest.data);

        console.log(`[${serviceTitle}] [COMMAND] Request validated`, !error);

        if (error) {
          throw new RequestValidationException({ issues: error.issues });
        }

        console.log(`[${serviceTitle}] [COMMAND] Handling command...`);
        const response = await commandConfig.handler(commandRequest, requestContext);

        res.status(response.status).json(response);
      } catch (error) {
        console.error(`[${serviceTitle}] [COMMAND]`, JSON.stringify(error, null, 2));

        if (error instanceof Exception) {
          res.status(error.status).json(error);
        } else {
          const unknownError = new UnknownException();

          if (error instanceof Error) {
            unknownError.message = error.message;
          }

          res.status(unknownError.status).json(unknownError);
        }
      }
    });

    // TODO handle unknown route

    const { port } = arg;

    expressServer.listen(port, () => {
      this.started = true;
      console.log(`[${serviceTitle}] Up and running on ${port}!`);
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
