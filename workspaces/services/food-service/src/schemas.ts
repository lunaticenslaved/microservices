import z from 'zod/v4';

// TODO move schemas to domain

export namespace Schemas {
  export const Product = z.object({
    id: z.uuid(),
    name: z.string().min(1, 'At least one letter in name should be').trim(),
    nutrientsId: z.uuid(),
    userId: z.uuid(),
  });
}
