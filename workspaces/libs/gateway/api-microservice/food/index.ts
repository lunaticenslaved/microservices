import { ServiceContract } from '../../interfaces/ServiceContract';

// Product
export * from './product/exceptions';
export * from './product/dtos';
export { ProductEntityConfig } from './product/entity-config';
import * as ProductCommands from './product/commands';

// Meal
export * from './meal/exceptions';
export * from './product/dtos';
export { MealEntityConfig } from './meal/entity-config';
import * as MealCommands from './meal/commands';

export type CommandConfigs =
  // Product
  | ProductCommands.CreateCommand
  | ProductCommands.UpdateCommand
  | ProductCommands.DeleteCommand
  | ProductCommands.FindManyCommand

  // Meal
  | MealCommands.CreateCommand
  | MealCommands.UpdateCommand
  | MealCommands.DeleteCommand
  | MealCommands.FindManyCommand;

export const Contract = new ServiceContract<CommandConfigs>({
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
