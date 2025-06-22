import { Services } from './services';
import { z } from 'zod/v4';

export type IRequest<
  TCommand extends `${Services}/${string}` = `${Services}/${string}`,
  TData = unknown,
> = {
  command: TCommand;
  data: TData;
};

export const RequestSchema = z.object({
  command: z.custom<`${Services}/${string}`>(
    (value): value is `${Services}/${string}` => {
      const [service] = String(value).split('/');

      return Object.values(Services).includes(service as Services);
    },
    { message: 'Must be in format `${Service}/string`' },
  ),
  data: z.any(),
});

export function getServiceFromRequest(req: IRequest) {
  const service = req.command.split('/')[0] as Services;

  return service;
}
