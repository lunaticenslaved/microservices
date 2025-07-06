import { ICommandContract } from './CommandContract';

type SavedConfig = {
  command: ICommandContract['command'];
  request: {
    enrichments: ICommandContract['request']['enrichments'];
  };
};

export class ServiceContract<TCommands extends ICommandContract = ICommandContract> {
  private commands: Record<string, SavedConfig> = {};

  createCommand<TCommand extends TCommands>(
    config: Pick<TCommand, 'command'> & {
      request: { enrichments: TCommand['request']['enrichments'] };
    },
  ) {
    this.commands[config.command] = config;
  }

  findCommand(command: string): SavedConfig | undefined {
    return this.commands[command];
  }
}

export type GetServiceContractCommands<T> =
  T extends ServiceContract<infer U> ? U : never;
