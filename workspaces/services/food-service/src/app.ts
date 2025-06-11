import { Command } from '@libs/types';
import express, { Express } from 'express';
import z from 'zod/v4';
import { prisma } from './prisma';
import { SERVICE } from '#/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMMANDS: Record<string, any> = {};

type CommandOptions<
  TReq extends Command.IRequest<unknown>,
  TRes extends Command.IResponse<unknown> = Command.IResponse<unknown>,
> = {
  validator: z.ZodType<TReq['data']>;
  handler: (data: TReq, context: App.ICommandContext) => Promise<TRes>;
};

export class App {
  static express: Express = express();

  static addCommand<
    TReq extends Command.IRequest<unknown>,
    TRes extends Command.IResponse<unknown>,
  >(command: string, arg: CommandOptions<TReq, TRes>) {
    COMMANDS[command] = {
      ...arg,
      command,
      service: SERVICE,
    };

    return arg;
  }

  static findCommand(
    action: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): CommandOptions<any, Command.IResponse<unknown>> | undefined {
    return COMMANDS[action];
  }
}

export namespace App {
  export interface ICommandContext {
    prisma: typeof prisma;
  }
}
