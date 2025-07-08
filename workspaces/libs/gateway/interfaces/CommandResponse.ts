import { ICommandContract } from './CommandContract';

export type ICommandResponse<TCommand extends ICommandContract> =
  | ICommandSuccessResponse<TCommand>
  | ICommandErrorResponse<TCommand>;

export type ICommandSuccessResponse<TCommand extends ICommandContract> = {
  success: true;
  status: number;
  data: TCommand['response']['data'];
};

export type ICommandErrorResponse<TCommand extends ICommandContract> =
  TCommand['exceptions'];
