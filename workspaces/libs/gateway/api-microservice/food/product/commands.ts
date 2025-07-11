import { NumberUpdate } from '@libs/common';

import { ICommandContract } from '../../../interfaces';

import { ProductNameNotUniqueException, ProductNotFoundException } from './exceptions';
import { ProductDTO } from './dtos';
import { ProductFindManyInput } from './entity-config';

// CREATE --------------------------------------------------------------------------------
export type CreateCommand = ICommandContract<{
  command: 'food/product/create';
  request: {
    data: {
      name: string;
      nutrients?: {
        calories?: number;
        proteins?: number;
        fats?: number;
        carbs?: number;
        fibers?: number;
      };
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: ProductDTO;
  };
  exceptions: ProductNameNotUniqueException;
}>;

// UPDATE --------------------------------------------------------------------------------
export type UpdateCommand = ICommandContract<{
  command: 'food/product/update';
  request: {
    data: {
      id: string;
      name?: string;
      nutrients?: {
        calories?: NumberUpdate;
        proteins?: NumberUpdate;
        fats?: NumberUpdate;
        carbs?: NumberUpdate;
        fibers?: NumberUpdate;
      };
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: ProductDTO;
  };
  exceptions: ProductNotFoundException | ProductNameNotUniqueException;
}>;

// DELETE --------------------------------------------------------------------------------
export type DeleteCommand = ICommandContract<{
  command: 'food/product/delete';
  request: {
    data: {
      id: string;
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: void;
  };
  exceptions: ProductNotFoundException;
}>;

// FIND MANY -----------------------------------------------------------------------------
export type FindManyCommand = ICommandContract<{
  command: 'food/product/find-many';
  request: {
    data: ProductFindManyInput;
    enrichments: {
      user: true;
    };
  };
  response: {
    data: {
      items: ProductDTO[];
    };
  };
  exceptions: ProductNotFoundException;
}>;
