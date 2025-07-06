import { ICommandContract } from './CommandContract';

export type ICommandResponse<TCommand extends ICommandContract> =
  | ICommandSuccessResponse<TCommand>
  | ICommandErrorResponse<TCommand>;

type ICommandSuccessResponse<TCommand extends ICommandContract> = {
  success: true;
  status: number;
  data: TCommand['response']['data'];
};

type ICommandErrorResponse<TCommand extends ICommandContract> = {
  success: false;
  status: number;
  exception: TCommand['exceptions'];
};
