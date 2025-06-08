import { Action } from '#/app';

export function createNameNotUniqueError(arg: { name: string }) {
  return new Action.Error({
    type: 'product/name-not-unique',
    status: 400,
    message: `Product with name '${arg.name}' already exists`,
    details: null,
  });
}
