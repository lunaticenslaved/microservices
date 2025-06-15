import express, { Express } from 'express';
import z from 'zod/v4';

import { Gateway } from '@libs/gateway';

import { SERVICE } from '#/constants';
import { DB } from '#/db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMMANDS: Record<string, any> = {};

type CommandOptions<
  TReq extends Gateway.IRequest<string, unknown>,
  TRes extends Gateway.IResponse<unknown>,
  TErr extends Gateway.IException<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  validator: z.ZodType<TReq['data']>;
  handler: (data: TReq, context: App.ICommandContext) => Promise<TRes | TErr>;
};

export class App {
  static express: Express = express();

  static addCommand<
    TReq extends Gateway.IRequest<string, unknown>,
    TRes extends Gateway.IResponse<unknown>,
    TErr extends Gateway.Exception<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  >(command: TReq['command'], arg: CommandOptions<TReq, TRes, TErr>) {
    COMMANDS[command] = {
      ...arg,
      command,
      service: SERVICE,
      handler: (req: TReq, context: App.ICommandContext) => {
        const validationResult = arg.validator.safeParse(req.data);

        if (validationResult.error) {
          throw Gateway.createRequestValidationException({
            issues: validationResult.error.issues,
          });
        }

        return arg.handler(
          {
            ...req,
            data: validationResult.data,
          },
          context,
        );
      },
    };

    return COMMANDS[command];
  }

  static findCommand(action: string):
    | CommandOptions<
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        Gateway.IResponse<unknown>,
        Gateway.IException<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
      >
    | undefined {
    return COMMANDS[action];
  }

  static createCommandContext(arg: { db: DB; userId: string }): App.ICommandContext {
    return {
      ...arg,
    };
  }
}

export namespace App {
  export interface ICommandContext {
    db: DB;
    userId: string;
  }
}
