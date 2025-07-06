import { ServiceContract } from '../../interfaces/ServiceContract';

import * as FoodProduct from './product';

export type FoodCommandConfig =
  | FoodProduct.CreateCommand
  | FoodProduct.UpdateCommand
  | FoodProduct.DeleteCommand
  | FoodProduct.FindFirstCommand
  | FoodProduct.FindManyCommand;

export const FoodContract = new ServiceContract<FoodCommandConfig>({
  'food/product/create': {
    request: { enrichments: { user: true } },
  },
  'food/product/update': {
    request: { enrichments: { user: true } },
  },
  'food/product/delete': {
    request: { enrichments: { user: true } },
  },
  'food/product/find-first': {
    request: { enrichments: { user: true } },
  },
  'food/product/find-many': {
    request: { enrichments: { user: true } },
  },
});

export { FoodProduct };
