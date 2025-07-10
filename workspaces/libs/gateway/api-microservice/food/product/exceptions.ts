import { Exception } from '../../../interfaces';

export class NameNotUniqueException extends Exception<
  'food/product/name-not-unique',
  null
> {
  constructor(arg: { name: string }) {
    super({
      type: 'food/product/name-not-unique',
      status: 400,
      message: `Product with name '${arg.name}' already exists`,
      details: null,
    });
  }
}

export class NotFoundException extends Exception<'food/product/not-found', null> {
  constructor(arg: { id: string } | { name: string }) {
    super({
      type: 'food/product/not-found',
      status: 404,
      message:
        'id' in arg
          ? `Product with id '${arg.id}' not found`
          : `Product with name '${arg.name}' not found`,
      details: null,
    });
  }
}
