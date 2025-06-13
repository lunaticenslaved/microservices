import { z } from 'zod/v4';

export type IRequest<TData> = {
  service: 'food';
  command: string;
  data: TData;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RequestSchema: z.ZodType<IRequest<any>> = z.object({
  service: z.literal('food'),
  command: z.string(),
  data: z.any(),
});
