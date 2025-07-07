// import z from 'zod/v4';
import { ExtractCommandContract, ServiceCommandConfig } from '../api-microservice';

import { ICommandContract } from './CommandContract';

type SavedConfig<T extends ICommandContract> = {
  request: {
    // validator: z.ZodType<T['request']['data']>;
    enrichments: T['request']['enrichments'];
  };
};

type CommandMap<T extends ServiceCommandConfig> = {
  [K in T['command']]: SavedConfig<ExtractCommandContract<K>>;
};

export class ServiceContract<T extends ServiceCommandConfig> {
  private commands: CommandMap<T>;

  constructor(commands: CommandMap<T>) {
    this.commands = commands;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findCommand(command: string): SavedConfig<any> | undefined {
    if (command in this.commands) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.commands[command as keyof typeof this.commands] as SavedConfig<any>;
    }

    return undefined;
  }
}
