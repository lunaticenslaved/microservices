import { CommonExceptions } from './index-ns';

export type Command<TReq, TRes, TExc> = {
  request: TReq;
  response: TRes;
  exceptions: TExc | CommonExceptions;
};
