import z from 'zod/v4';
import { Gateway } from '../../gateway';

// PRODUCT -----------------------------------------------------------------------------
export type Product = {
  id: string;
  name: string;
  nutrientsId: string;
  userId: string;
};

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'At least one letter in name should be').trim(),
  nutrientsId: z.uuid(),
  userId: z.uuid(),
}) satisfies z.ZodType<Product>;

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
