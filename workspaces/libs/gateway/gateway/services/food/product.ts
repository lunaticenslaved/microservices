import { Gateway } from '../../../gateway';
import { Domain } from '../../../domain';

import { NumberCreate, NumberUpdate, StringCreate, StringUpdate } from '../../common';

export namespace Product {
  export type DTO = {
    id: Domain.Food.Product['id'];
    name: Domain.Food.Product['name'];
    nutrients: Pick<
      Domain.Food.Nutrients,
      'calories' | 'carbs' | 'fats' | 'fibers' | 'proteins'
    >;
  };

  // CREATE --------------------------------------------------------------------------------
  export type CreateExceptions =
    | Domain.Food.ProductNameNotUniqueException
    | Gateway.CommonExceptions;
  export type CreateResponse = Gateway.IResponse<DTO>;
  export type CreateRequest = Gateway.IRequest<
    'product/create',
    {
      name: StringCreate;
      nutrients?: {
        calories?: NumberCreate;
        proteins?: NumberCreate;
        fats?: NumberCreate;
        carbs?: NumberCreate;
        fibers?: NumberCreate;
      };
    }
  >;

  // UPDATE --------------------------------------------------------------------------------
  export type UpdateExceptions =
    | Domain.Food.ProductNotFoundException
    | Domain.Food.ProductNameNotUniqueException
    | Gateway.CommonExceptions;
  export type UpdateResponse = Gateway.IResponse<DTO>;
  export type UpdateRequest = Gateway.IRequest<
    'product/update',
    {
      id: string;
      name?: StringUpdate;
      nutrients?: {
        calories?: NumberUpdate;
        proteins?: NumberUpdate;
        fats?: NumberUpdate;
        carbs?: NumberUpdate;
        fibers?: NumberUpdate;
      };
    }
  >;

  // DELETE --------------------------------------------------------------------------------
  export type DeleteExceptions =
    | Domain.Food.ProductNotFoundException
    | Gateway.CommonExceptions;
  export type DeleteResponse = Gateway.IResponse<void>;
  export type DeleteRequest = Gateway.IRequest<'product/delete', { id: string }>;

  // FIND FIRST ----------------------------------------------------------------------------
  export type FindFirstExceptions = Gateway.CommonExceptions;
  export type FindFirstResponse = Gateway.IResponse<DTO | null>;
  export type FindFirstRequest = Gateway.IRequest<'product/find-first', { id: string }>;

  // FIND MANY -----------------------------------------------------------------------------
  export type FindManyExceptions = Gateway.CommonExceptions;
  export type FindManyRequest = Gateway.IRequest<'product/find-many', unknown>;
  export type FindManyResponse = Gateway.IResponse<{ items: DTO[] }>;
}
