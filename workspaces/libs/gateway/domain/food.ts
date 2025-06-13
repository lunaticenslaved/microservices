import { Gateway } from '../gateway';

// PRODUCT -----------------------------------------------------------------------------
export type Product = {
  id: string;
  name: string;
};

export type ProductNameNotUniqueException =
  Gateway.IException<'food/product/name-not-unique'>;

export function createProductNameNotUniqueException(arg: {
  name: string;
}): ProductNameNotUniqueException {
  return Gateway.createException({
    type: 'food/product/name-not-unique',
    status: 400,
    message: `Product with name '${arg.name}' already exists`,
    details: null,
  });
}

export type ProductNotFoundException = Gateway.IException<'food/product/not-found'>;
export function createProductNotFoundException(arg: {
  id: string;
}): ProductNotFoundException {
  return Gateway.createException({
    type: 'food/product/not-found',
    status: 404,
    message: `Product with id '${arg.id}' not found`,
    details: null,
  });
}
