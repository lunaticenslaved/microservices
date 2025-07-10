import { ICommandContract } from '../../../interfaces';

import * as Product from '../product';

import { MealFindManyInput } from './entity-config';
import * as MealExceptions from './exceptions';

export type DTO = {
  id: string;
  datetime: string;
  grams: number;
  productId: string;
};

export type CreateCommand = ICommandContract<{
  command: 'food/meal/create';
  request: {
    data: {
      datetime?: string;
      productId: string;
      grams: number;
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: DTO;
  };
  exceptions: Product.NotFoundException | MealExceptions.ProductInDatetimeExistsException;
}>;

export type UpdateCommand = ICommandContract<{
  command: 'food/meal/update';
  request: {
    data: {
      id: string;
      datetime?: string;
      productId?: string;
      grams?: number;
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: DTO;
  };
  exceptions: Product.NotFoundException;
}>;

export type DeleteCommand = ICommandContract<{
  command: 'food/meal/delete';
  request: {
    data: {
      id: string;
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: null;
  };
  exceptions: MealExceptions.NotFoundException;
}>;

export type FindManyCommand = ICommandContract<{
  command: 'food/meal/find-many';
  request: {
    data: MealFindManyInput;
    enrichments: {
      user: true;
    };
  };
  response: {
    data: {
      items: DTO[];
    };
  };
  exceptions: null;
}>;
