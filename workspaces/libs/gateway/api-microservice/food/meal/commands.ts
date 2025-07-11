import { ICommandContract } from '../../../interfaces';

import { ProductNotFoundException } from '../product/exceptions';
import { MealFindManyInput } from './entity-config';
import {
  MealNotFoundException,
  MealProductInDatetimeExistsException,
} from './exceptions';
import { MealDTO } from './dtos';

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
    data: MealDTO;
  };
  exceptions: ProductNotFoundException | MealProductInDatetimeExistsException;
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
    data: MealDTO;
  };
  exceptions: ProductNotFoundException;
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
  exceptions: MealNotFoundException;
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
      items: MealDTO[];
    };
  };
  exceptions: null;
}>;
