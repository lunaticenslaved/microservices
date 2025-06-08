import { Command } from '@libs/types';

export namespace Errors.Product {
  export function createNameNotUniqueError(arg: { name: string }) {
    return new Command.Error({
      type: 'product/name-not-unique',
      status: 400,
      message: `Product with name '${arg.name}' already exists`,
      details: null,
    });
  }
}
