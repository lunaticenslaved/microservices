import z from 'zod/v4';

export type Product = {
  id: string;
  name: string;
  nutrientsId: string;
  userId: string;
};

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'At least one letter in name should be').trim(),
  nutrientsId: z.uuid(),
  userId: z.uuid(),
}) satisfies z.ZodType<Product>;
