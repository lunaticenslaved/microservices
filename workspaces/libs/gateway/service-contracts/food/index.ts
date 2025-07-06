import { ServiceContract } from '../../interfaces/ServiceContract';

import * as Product from './product';

type Command =
  | Product.CreateCommand
  | Product.UpdateCommand
  | Product.DeleteCommand
  | Product.FindFirstCommand
  | Product.FindManyCommand;

export const Contract = new ServiceContract<Command>();

export { Product };

// PRODUCT ---------------------------------------------------------------------------------
Contract.createCommand<Product.CreateCommand>({
  command: 'food/product/create',
  request: {
    enrichments: {
      user: true,
    },
  },
});

Contract.createCommand<Product.UpdateCommand>({
  command: 'food/product/update',
  request: {
    enrichments: {
      user: true,
    },
  },
});

Contract.createCommand<Product.DeleteCommand>({
  command: 'food/product/delete',
  request: {
    enrichments: {
      user: true,
    },
  },
});

Contract.createCommand<Product.FindFirstCommand>({
  command: 'food/product/find-first',
  request: {
    enrichments: {
      user: true,
    },
  },
});

Contract.createCommand<Product.FindManyCommand>({
  command: 'food/product/find-many',
  request: {
    enrichments: {
      user: true,
    },
  },
});
