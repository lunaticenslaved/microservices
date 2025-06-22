import { Domain } from '@libs/domain';
import { Gateway } from '../..';

import { NumberCreate, NumberUpdate, StringCreate, StringUpdate } from '../../common';
import { Command } from '../../Command';

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
  type CreateExceptions = NameNotUniqueException | Gateway.CommonExceptions;
  type CreateResponse = Gateway.IResponse<DTO>;
  type CreateRequest = Gateway.IRequest<
    'food/product/create',
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
  export type CreateCommand = Command<CreateRequest, CreateResponse, CreateExceptions>;

  // UPDATE --------------------------------------------------------------------------------
  type UpdateExceptions =
    | NotFoundException
    | NameNotUniqueException
    | Gateway.CommonExceptions;
  type UpdateResponse = Gateway.IResponse<DTO>;
  type UpdateRequest = Gateway.IRequest<
    'food/product/update',
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
  export type UpdateCommand = Command<UpdateRequest, UpdateResponse, UpdateExceptions>;

  // DELETE --------------------------------------------------------------------------------
  type DeleteExceptions = NotFoundException | Gateway.CommonExceptions;
  type DeleteResponse = Gateway.IResponse<void>;
  type DeleteRequest = Gateway.IRequest<'food/product/delete', { id: string }>;
  export type DeleteCommand = Command<DeleteRequest, DeleteResponse, DeleteExceptions>;

  // FIND FIRST ----------------------------------------------------------------------------
  type FindFirstExceptions = Gateway.CommonExceptions;
  type FindFirstResponse = Gateway.IResponse<DTO | null>;
  type FindFirstRequest = Gateway.IRequest<'food/product/find-first', { id: string }>;
  export type FindFirstCommand = Command<
    FindFirstRequest,
    FindFirstResponse,
    FindFirstExceptions
  >;

  // FIND MANY -----------------------------------------------------------------------------
  type FindManyExceptions = Gateway.CommonExceptions;
  type FindManyRequest = Gateway.IRequest<'food/product/find-many', unknown>;
  type FindManyResponse = Gateway.IResponse<{ items: DTO[] }>;
  export type FindManyCommand = Command<
    FindManyRequest,
    FindManyResponse,
    FindManyExceptions
  >;
}
