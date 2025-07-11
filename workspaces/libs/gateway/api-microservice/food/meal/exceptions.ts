import { Exception } from '../../../interfaces';

export class MealNotFoundException extends Exception<'food/meal/not-found', null> {
  constructor(arg: { id: string }) {
    super({
      type: 'food/meal/not-found',
      status: 400,
      message: `Meal with id '${arg.id}' not found`,
      details: null,
    });
  }
}

export class MealProductInDatetimeExistsException extends Exception<
  'food/meal/product-in-datetime-exists',
  null
> {
  constructor(arg: { productId: string }) {
    super({
      type: 'food/meal/product-in-datetime-exists',
      status: 400,
      message: `Product with id '${arg.productId}' already exists in the datetime`,
      details: null,
    });
  }
}
