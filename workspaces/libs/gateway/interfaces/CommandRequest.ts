import { ICommandContract } from './CommandContract';

export type ICommandRequest<TCommand extends ICommandContract> = {
  command: TCommand['command'];
  data: TCommand['request']['data'];
  enrichments: {
    user: TCommand['request']['enrichments']['user'] extends true
      ? { id: string }
      : undefined;
  };
};
