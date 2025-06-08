/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import Zod, { ZodIssue } from 'zod/v4';

const ACTIONS: Record<string, any> = {};

type ActionOptions<
  TReq extends Action.IRequest<unknown>,
  TRes extends Action.IResponse<unknown> = Action.IResponse<unknown>,
> = {
  action: string;
  validator: Zod.ZodType<TReq['data']>;
  handler: (data: TReq, context: Action.IContext) => Promise<TRes>;
};

export namespace Action {
  export function add<
    TReq extends Action.IRequest<unknown>,
    TRes extends Action.IResponse<unknown>,
  >(arg: ActionOptions<TReq, TRes>) {
    ACTIONS[arg.action] = arg;

    return arg;
  }

  export function find(
    action: string,
  ): ActionOptions<any, Action.IResponse<unknown>> | undefined {
    return ACTIONS[action];
  }

  export type IRequest<TData> = {
    action: string;
    data: TData;
  };

  export type IResponse<TData> = {
    success: true;
    data: TData;
    status: number;
  };

  export type IError<TType extends string, TDetails = null> = {
    success: false;
    status: number;
    type: TType;
    message: string;
    details: TDetails;
  };

  export type IContext = {
    prisma: PrismaClient;
  };

  export type ValidationError = IError<'common/validation-error', ZodIssue[]>;
  export type UnknownActionError = IError<'common/unknown-action'>;
  export type UnknownError = IError<'common/unknown-error'>;

  export class Error<TType extends string, TDetails> implements IError<TType, TDetails> {
    static Common = {
      validation: 'common/validation-error' as const,
      unknownAction: 'common/unknown-action' as const,
      unknownError: 'common/unknown-error' as const,
    };

    success = false as const;
    status: number;
    type: TType;
    message: string;
    details: TDetails;

    constructor(arg: {
      type: TType;
      status: number;
      message: string;
      details: TDetails;
    }) {
      this.type = arg.type;
      this.status = arg.status;
      this.message = arg.message;
      this.details = arg.details;
    }

    static createValidationError(arg: { issues: ZodIssue[] }): ValidationError {
      return new Error({
        type: 'common/validation-error',
        status: 400, // FIXME
        message: 'Request validation error',
        details: arg.issues,
      });
    }

    static createUnknownActionError(arg: { action: unknown }): UnknownActionError {
      return new Error({
        type: 'common/unknown-action',
        status: 400, // FIXME
        message: `Unknown action '${JSON.stringify(arg.action)}'`,
        details: null,
      });
    }

    static createUnknownError(): UnknownError {
      return new Error({
        type: 'common/unknown-error',
        status: 500, // FIXME
        message: 'Unknown error',
        details: null,
      });
    }
  }
}
