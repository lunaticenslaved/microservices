import { Gateway } from '..';

import { NumberCreate, NumberUpdate, StringCreate, StringUpdate } from '../common';
import { Domain } from '../../domain';

export namespace Product {
  // CREATE --------------------------------------------------------------------------------
  export type CreateErrors =
    | Domain.Food.ProductNameNotUniqueException
    | Gateway.CommonExceptions;
  export type CreateResponse = Gateway.IResponse<Domain.Food.Product>;
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
  export type UpdateErrors =
    | Domain.Food.ProductNotFoundException
    | Domain.Food.ProductNameNotUniqueException
    | Gateway.CommonExceptions;
  export type UpdateResponse = Gateway.IResponse<Domain.Food.Product>;
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
  export type DeleteErrors =
    | Domain.Food.ProductNotFoundException
    | Gateway.CommonExceptions;
  export type DeleteResponse = Gateway.IResponse<void>;
  export type DeleteRequest = Gateway.IRequest<'product/delete', { id: string }>;

  // GET -----------------------------------------------------------------------------------
  export type GetErrors = Domain.Food.ProductNotFoundException | Gateway.CommonExceptions;
  export type GetResponse = Gateway.IResponse<Domain.Food.Product>;
  export type GetRequest = Gateway.IRequest<
    'product/get',
    { id: string } | { name: string }
  >;

  // LIST ----------------------------------------------------------------------------------
  export type ListErrors = Gateway.CommonExceptions;
  export type ListRequest = Gateway.IRequest<'product/list', void>;
  export type ListResponse = Gateway.IResponse<{ items: Domain.Food.Product[] }>;
}
