import { ZodIssue } from 'zod/v4';
import { createException, IException } from './Exception';

export { type IException, Exception, createException } from './Exception';
export { type IRequest, RequestSchema, getServiceFromRequest } from './Request';
export { type IResponse, createResponse } from './Response';
export { type Command } from './Command';

// Services
export { Services } from './services';
export * as Food from './services/food-service';
// export * as Tag from './services/tag';

// COMMON EXCEPTIONS -------------------------------------------------------------------------
export type CommonExceptions =
  | RequestValidationException
  | UnknownCommandException
  | UnknownException
  | MicroserviceTimeoutException;

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

export type UnknownCommandException = IException<'common/unknown-action'>;
export function createUnknownCommandException(arg: {
  action: unknown;
}): UnknownCommandException {
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

export type MicroserviceTimeoutException = IException<'common/microservice-timeout'>;
export function createMicroserviceTimeoutException(): MicroserviceTimeoutException {
  return createException({
    type: 'common/microservice-timeout',
    status: 504,
    message: 'Microservice timeout',
    details: null,
  });
}

export type GatewayException = IException<'common/gateway-error'>;
export function createGatewayException(): GatewayException {
  return createException({
    type: 'common/gateway-error',
    status: 500,
    message: 'Gateway error',
    details: null,
  });
}
