import { ServiceCommandConfig, ExtractCommandContract } from './api-microservice';
import { ICommandErrorResponse, ICommandSuccessResponse } from './interfaces';

export type IGatewayResponse<
  T extends ServiceCommandConfig['command'] = ServiceCommandConfig['command'],
> = IGatewaySuccessResponse<T> | IGatewayErrorResponse<T>;

export type IGatewaySuccessResponse<T extends ServiceCommandConfig['command']> =
  ICommandSuccessResponse<ExtractCommandContract<T>>;

export type IGatewayErrorResponse<T extends ServiceCommandConfig['command']> =
  ICommandErrorResponse<ExtractCommandContract<T>>;
