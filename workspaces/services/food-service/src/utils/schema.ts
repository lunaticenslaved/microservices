import z from 'zod/v4';

export type NumberUpdate = {
  type: 'SET' | 'INCREMENT' | 'DECREMENT' | 'MULTIPLY' | 'DIVIDE';
  value: number;
};

export const SchemaUtils = {
  numberUpdate: (value: z.ZodNumber): z.ZodType<NumberUpdate> => {
    return z.object({
      type: z.union([
        z.literal('SET'),
        z.literal('INCREMENT'),
        z.literal('DECREMENT'),
        z.literal('MULTIPLY'),
        z.literal('DIVIDE'),
      ]),
      value,
    });
  },
};
