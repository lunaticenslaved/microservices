import { ServiceCommandConfig, ExtractCommandContract } from './api-microservice';
import { ICommandResponse } from './interfaces';

export type IGatewayResponse<
  T extends ServiceCommandConfig['command'] = ServiceCommandConfig['command'],
> = ICommandResponse<ExtractCommandContract<T>>;
