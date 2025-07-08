import z from 'zod/v4';

export type Meal = {
  id: string;
  datetime: string;
  grams: number;
  productId: string;
};

export const MealSchema: z.ZodType<Meal> = z.object({
  id: z.uuid(),
  datetime: z.iso.datetime(),
  grams: z.number().gt(0),
  productId: z.uuid(),
});
