import { IException } from './Exception';
import { CommonExceptions } from './common-exceptions';

type ConfigArg = {
  command: string;
  request: {
    data: unknown;
    enrichments: {
      user?: true;
    };
  };
  response: {
    data: unknown;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exceptions: IException<any, any>;
};

export type ICommandContract<TArg extends ConfigArg = ConfigArg> = Omit<
  TArg,
  'exceptions'
> & {
  exceptions: TArg['exceptions'] | CommonExceptions;
};
