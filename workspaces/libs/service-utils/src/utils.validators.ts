import { NumberUpdate } from '@libs/common';
import z from 'zod/v4';

export const createNumberUpdateSchema = (value: z.ZodNumber): z.ZodType<NumberUpdate> => {
  return z.object({ set: value });
};
