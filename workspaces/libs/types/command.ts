import z, { ZodIssue } from 'zod/v4';

export namespace Command {
  export type IRequest<TData> = {
    service: 'food';
    command: string;
    data: TData;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const RequestValidator: z.ZodType<IRequest<any>> = z.object({
    service: z.literal('food'),
    command: z.string(),
    data: z.any(),
  });

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

  export namespace CommonError {
    export type Any = RequestValidation | UnknownAction | UnknownError;

    export type RequestValidation = IError<'common/validation-error', ZodIssue[]>;
    export type UnknownAction = IError<'common/unknown-action'>;
    export type UnknownError = IError<'common/unknown-error'>;
  }

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

    static createRequestValidationError(arg: {
      issues: ZodIssue[];
    }): CommonError.RequestValidation {
      return new Error({
        type: 'common/validation-error',
        status: 400, // FIXME
        message: 'Request validation error',
        details: arg.issues,
      });
    }

    static createUnknownActionError(arg: { action: unknown }): CommonError.UnknownAction {
      return new Error({
        type: 'common/unknown-action',
        status: 400, // FIXME
        message: `Unknown action '${JSON.stringify(arg.action)}'`,
        details: null,
      });
    }

    static createUnknownError(): CommonError.UnknownError {
      return new Error({
        type: 'common/unknown-error',
        status: 500, // FIXME
        message: 'Unknown error',
        details: null,
      });
    }
  }
}
