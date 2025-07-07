import { FoodDomain } from '@libs/domain';
import { NumberUpdate } from '@libs/common';

import { Exception, ICommandContract } from '../../interfaces';

export class NameNotUniqueException extends Exception<
  'food/product/name-not-unique',
  null
> {
  constructor(arg: { name: string }) {
    super({
      type: 'food/product/name-not-unique',
      status: 400,
      message: `Product with name '${arg.name}' already exists`,
      details: null,
    });
  }
}

export class NotFoundException extends Exception<'food/product/not-found', null> {
  constructor(arg: { id: string }) {
    super({
      type: 'food/product/not-found',
      status: 404,
      message: `Product with id '${arg.id}' not found`,
      details: null,
    });
  }
}

// ---------------------------------------------------------------------------------------
// DTO'S ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
export type DTO = {
  id: FoodDomain.Product['id'];
  name: FoodDomain.Product['name'];
  nutrients: Pick<
    FoodDomain.Nutrients,
    'calories' | 'carbs' | 'fats' | 'fibers' | 'proteins'
  >;
};

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
    data: DTO;
  };
  exceptions: NameNotUniqueException;
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
    data: DTO;
  };
  exceptions: NotFoundException | NameNotUniqueException;
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
  exceptions: NotFoundException;
}>;

// FIND FIRST ----------------------------------------------------------------------------
export type FindFirstCommand = ICommandContract<{
  command: 'food/product/find-first';
  request: {
    data: {
      id: string;
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: DTO;
  };
  exceptions: NotFoundException;
}>;

// FIND MANY -----------------------------------------------------------------------------
export type FindManyCommand = ICommandContract<{
  command: 'food/product/find-many';
  request: {
    data: {
      id: { in: string[] };
    };
    enrichments: {
      user: true;
    };
  };
  response: {
    data: {
      items: DTO[];
    };
  };
  exceptions: NotFoundException;
}>;
