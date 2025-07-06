import z from 'zod/v4';

import path from 'path';
import fs from 'fs';
import express from 'express';

import {
  Exception,
  RequestValidationException,
  UnknownCommandException,
  UnknownException,
  ICommandContract,
  ICommandRequest,
  ServiceContract,
  SuccessResponse,
  GetServiceContractCommands,
} from '@libs/gateway';

import { ServiceConfig } from './types';

// import cors from 'cors';
// const CORS_ORIGIN_WHITELIST: string[] = [];

type ServiceCommandConfig<TContract extends ICommandContract, TContext> = {
  command: TContract['command'];
  validator: z.ZodType<TContract['request']['data']>;
  handler: (
    request: ICommandRequest<TContract>,
    context: TContext,
  ) => Promise<SuccessResponse<TContract['response']['data']> | TContract['exceptions']>;
};

type ApplicationConstructor<TConfig, TContract> = {
  config: TConfig;
  contract: TContract;
};

export class Application<
  TConfig extends ServiceConfig,
  TCommandContext,
  TContract extends ServiceContract,
> {
  started = false;

  config: TConfig;
  contract: TContract;

  constructor(arg: ApplicationConstructor<TConfig, TContract>) {
    this.config = arg.config;
    this.contract = arg.contract;
  }

  private commands: Record<
    string,
    ServiceCommandConfig<GetServiceContractCommands<TContract>, TCommandContext>
  > = {};

  addCommand<TCommand extends GetServiceContractCommands<TContract>>(
    config: ServiceCommandConfig<TCommand, TCommandContext>,
  ) {
    this.commands[config.command] = config as unknown as ServiceCommandConfig<
      GetServiceContractCommands<TContract>,
      TCommandContext
    >;

    return config;
  }

  findCommandConfigOfThrow(command: string) {
    const commandConfig = this.commands[command] as
      | ServiceCommandConfig<GetServiceContractCommands<TContract>, TCommandContext>
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
    createCommandContext: (arg: { serviceConfig: TConfig }) => TCommandContext;
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

        // FIXME check if the request is sent by Gateway

        console.log(`[${serviceTitle}] [COMMAND]`, req.body);

        const requestContext = arg.createCommandContext({ serviceConfig: this.config });

        const commandConfig = this.findCommandConfigOfThrow(req.body?.command);

        // Если Gateway пропустил сюда, то структура запроса уже валидна
        const commandRequest = req.body as ICommandRequest<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
        const { error } = commandConfig.validator.safeParse(commandRequest.data);

        if (error) {
          throw new RequestValidationException({ issues: error.issues });
        }

        const response = await commandConfig.handler(commandRequest, requestContext);

        res.status(response.status).json(response);
      } catch (error) {
        console.error(`[${serviceTitle}] [COMMAND]`, error);

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

    // FIXME handle unknown route

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
