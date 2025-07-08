import z from 'zod/v4';
import { NumberUpdate } from '@libs/common';

export const ServiceUtils = {
  numberUpdate: {
    schema: (value: z.ZodNumber): z.ZodType<NumberUpdate> => {
      return z.object({ set: value });
    },
    prisma: (value: NumberUpdate) => {
      return {
        set: value.set,
      };
    },
  },
};
