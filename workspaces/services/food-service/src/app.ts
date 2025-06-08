import { Command } from '@libs/types';
import express, { Express } from 'express';
import z from 'zod/v4';
import { prisma } from './prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMMANDS: Record<string, any> = {};

type CommandOptions<
  TReq extends Command.IRequest<unknown>,
  TRes extends Command.IResponse<unknown> = Command.IResponse<unknown>,
> = {
  command: string;
  validator: z.ZodType<TReq['data']>;
  handler: (data: TReq, context: App.ICommandContext) => Promise<TRes>;
};

export class App {
  static express: Express = express();

  static addCommand<
    TReq extends Command.IRequest<unknown>,
    TRes extends Command.IResponse<unknown>,
  >(arg: CommandOptions<TReq, TRes>) {
    COMMANDS[arg.command] = arg;

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
