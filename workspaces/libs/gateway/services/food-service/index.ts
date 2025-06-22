import { Product } from './product';

export { Product };

export type Commands =
  // Product
  | Product.CreateCommand
  | Product.UpdateCommand
  | Product.DeleteCommand
  | Product.FindFirstCommand
  | Product.FindManyCommand;
