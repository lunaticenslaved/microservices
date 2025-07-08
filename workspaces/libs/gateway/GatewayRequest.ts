import z from 'zod/v4';

import {
  ServiceCommandConfig,
  Service,
  ExtractCommandContract,
} from './api-microservice';

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

export interface IGatewayRequest<
  T extends ServiceCommandConfig['command'] = ServiceCommandConfig['command'],
> {
  command: T;
  data: ExtractCommandContract<T>['request']['data'];
}

// export class Gateway {
//   static request<T extends ServiceCommandConfig['command']>(arg: IGatewayRequest<T>) {
//     return arg;
//   }
// }
