import { ZodIssue } from 'zod/v4';

export { type IException, Exception, createException } from './Exception';
export { type IRequest, RequestSchema } from './Request';
export { type IResponse } from './Response';

export * as Food from './services/food';

import { createException, IException } from './Exception';

// COMMON EXCEPTIONS -------------------------------------------------------------------------
export type CommonExceptions =
  | RequestValidationException
  | UnknownActionException
  | UnknownException;

export type RequestValidationException = IException<
  'common/validation-error',
  ZodIssue[]
>;
export function createRequestValidationException(arg: {
  issues: ZodIssue[];
}): RequestValidationException {
  return createException({
    type: 'common/validation-error',
    status: 400,
    message: 'Request validation error',
    details: arg.issues,
  });
}

export type UnknownActionException = IException<'common/unknown-action'>;
export function createUnknownActionException(arg: {
  action: unknown;
}): UnknownActionException {
  return createException({
    type: 'common/unknown-action',
    status: 400,
    message: `Unknown action '${JSON.stringify(arg.action)}'`,
    details: null,
  });
}

export type UnknownException = IException<'common/unknown-error'>;
export function createUnknownException(): UnknownException {
  return createException({
    type: 'common/unknown-error',
    status: 500,
    message: 'Unknown error',
    details: null,
  });
}
