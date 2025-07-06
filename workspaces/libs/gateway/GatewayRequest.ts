import z from 'zod/v4';

import { FoodService, Service } from './service-contracts';
import { GetServiceContractCommands } from './interfaces';

export const GatewayRequestSchema = z.object({
  command: z.custom<`${Service}/${string}`>(
    (value): value is `${Service}/${string}` => {
      const [service] = String(value).split('/');

      return Object.values(Service).includes(service as Service);
    },
    {
      message: 'Must be in format `${Service}/string`',
    },
  ),
  data: z.any(),
});

export interface IGatewayRequest<T extends ServicesCommands['command']> {
  command: `${Service}/${string}`;
  data: CommandContract<T>['request']['data'];
}

type Services = typeof FoodService.Contract;
type ServicesCommands = GetServiceContractCommands<Services>;

type CommandContract<T extends ServicesCommands['command']> = Extract<
  ServicesCommands,
  { command: T }
>;

export class Gateway {
  static request<T extends ServicesCommands['command']>(arg: IGatewayRequest<T>) {
    return arg;
  }
}
