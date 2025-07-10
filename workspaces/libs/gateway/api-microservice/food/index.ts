import { ServiceContract } from '../../interfaces/ServiceContract';

import * as FoodProduct from './product';
import * as FoodMeal from './meal';

export { FoodProduct, FoodMeal };

export type FoodCommandConfig =
  // Product
  | FoodProduct.CreateCommand
  | FoodProduct.UpdateCommand
  | FoodProduct.DeleteCommand
  | FoodProduct.FindManyCommand

  // Meal
  | FoodMeal.CreateCommand
  | FoodMeal.UpdateCommand
  | FoodMeal.DeleteCommand
  | FoodMeal.FindManyCommand;

export const FoodContract = new ServiceContract<FoodCommandConfig>({
  // Product
  'food/product/create': { request: { enrichments: { user: true } } },
  'food/product/update': { request: { enrichments: { user: true } } },
  'food/product/delete': { request: { enrichments: { user: true } } },
  'food/product/find-many': { request: { enrichments: { user: true } } },

  // Meal
  'food/meal/create': { request: { enrichments: { user: true } } },
  'food/meal/update': { request: { enrichments: { user: true } } },
  'food/meal/delete': { request: { enrichments: { user: true } } },
  'food/meal/find-many': { request: { enrichments: { user: true } } },
});
