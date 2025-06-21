import { Domain } from '@libs/domain';
import { Gateway } from '../..';

import { NumberCreate, NumberUpdate, StringCreate, StringUpdate } from '../../common';

export namespace Product {
  // DTOs ----------------------------------------------------------------------------------
  export type DTO = {
    id: Domain.Food.Product['id'];
    name: Domain.Food.Product['name'];
    nutrients: Pick<
      Domain.Food.Nutrients,
      'calories' | 'carbs' | 'fats' | 'fibers' | 'proteins'
    >;
  };

  // Exceptions
  export type NameNotUniqueException = Gateway.IException<'food/product/name-not-unique'>;
  export function createNameNotUniqueException(arg: {
    name: string;
  }): NameNotUniqueException {
    return Gateway.createException({
      type: 'food/product/name-not-unique',
      status: 400,
      message: `Product with name '${arg.name}' already exists`,
      details: null,
    });
  }

  export type NotFoundException = Gateway.IException<'food/product/not-found'>;
  export function createNotFoundException(arg: { id: string }): NotFoundException {
    return Gateway.createException({
      type: 'food/product/not-found',
      status: 404,
      message: `Product with id '${arg.id}' not found`,
      details: null,
    });
  }

  // Commands
  // CREATE --------------------------------------------------------------------------------
  export type CreateExceptions = NameNotUniqueException | Gateway.CommonExceptions;
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
    | NotFoundException
    | NameNotUniqueException
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
  export type DeleteExceptions = NotFoundException | Gateway.CommonExceptions;
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
