import z from 'zod/v4';

export type Nutrients = {
  id: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  fibers: number;
};

export const NutrientsSchema = z.object({
  id: z.uuid(),
  calories: z.number().gte(0),
  proteins: z.number().gte(0),
  fats: z.number().gte(0),
  carbs: z.number().gte(0),
  fibers: z.number().gte(0),
}) satisfies z.ZodType<Nutrients>;
