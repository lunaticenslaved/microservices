import { ZodIssue } from 'zod/v4';
import { Exception } from './Exception';

export type CommonExceptions =
  | RequestValidationException
  | UnknownException
  | UnknownException
  | MicroserviceTimeoutException;

export class RequestValidationException extends Exception<
  'common/validation-error',
  ZodIssue[]
> {
  constructor(arg: { issues: ZodIssue[] }) {
    super({
      type: 'common/validation-error',
      status: 400,
      message: 'Request validation exception',
      details: arg.issues,
    });
  }
}

export class UnknownCommandException extends Exception<'common/unknown-command', null> {
  constructor(arg: { command: unknown }) {
    super({
      type: 'common/unknown-command',
      status: 400,
      message: `Unknown command '${JSON.stringify(arg.command)}'`,
      details: null,
    });
  }
}

export class UnknownException extends Exception<'common/unknown-error', null> {
  constructor() {
    super({
      type: 'common/unknown-error',
      status: 500,
      message: 'Unknown error',
      details: null,
    });
  }
}

export class MicroserviceTimeoutException extends Exception<
  'common/microservice-timeout',
  null
> {
  constructor() {
    super({
      type: 'common/microservice-timeout',
      status: 504,
      message: 'Microservice timeout',
      details: null,
    });
  }
}

export class GatewayException extends Exception<'common/gateway-error', null> {
  constructor() {
    super({
      type: 'common/gateway-error',
      status: 500,
      message: 'Gateway error',
      details: null,
    });
  }
}
