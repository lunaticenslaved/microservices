import { Gateway } from '..';

import { NumberCreate, NumberUpdate, StringCreate, StringUpdate } from '../common';
import { Domain } from '../../domain';

export namespace Product {
  export type DTO = {
    id: string;
    name: string;
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

  // GET -----------------------------------------------------------------------------------
  export type GetExceptions =
    | Domain.Food.ProductNotFoundException
    | Gateway.CommonExceptions;
  export type GetResponse = Gateway.IResponse<DTO>;
  export type GetRequest = Gateway.IRequest<'product/get', { id: string }>;

  // LIST ----------------------------------------------------------------------------------
  export type ListExceptions = Gateway.CommonExceptions;
  export type ListRequest = Gateway.IRequest<'product/list', unknown>;
  export type ListResponse = Gateway.IResponse<{ items: DTO[] }>;
}
