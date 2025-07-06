import { ServiceCommandConfig, ExtractCommandContract } from './service-contracts';
import { ICommandResponse } from './interfaces';

export type IGatewayResponse<
  T extends ServiceCommandConfig['command'] = ServiceCommandConfig['command'],
> = ICommandResponse<ExtractCommandContract<T>>;
