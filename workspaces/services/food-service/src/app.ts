import express, { Express } from 'express';
import z from 'zod/v4';
import { prisma } from './prisma';
import { SERVICE } from '#/constants';
import { Gateway } from '@libs/gateway';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMMANDS: Record<string, any> = {};

type CommandOptions<
  TReq extends Gateway.IRequest<unknown>,
  TRes extends Gateway.IResponse<unknown>,
  TErr extends Gateway.IException<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  validator: z.ZodType<TReq['data']>;
  handler: (data: TReq, context: App.ICommandContext) => Promise<TRes | TErr>;
};

export class App {
  static express: Express = express();

  static addCommand<
    TReq extends Gateway.IRequest<unknown>,
    TRes extends Gateway.IResponse<unknown>,
    TErr extends Gateway.IException<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  >(command: string, arg: CommandOptions<TReq, TRes, TErr>) {
    COMMANDS[command] = {
      ...arg,
      command,
      service: SERVICE,
    };

    return arg;
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
}

export namespace App {
  export interface ICommandContext {
    prisma: typeof prisma;
    userId: string;
  }
}
