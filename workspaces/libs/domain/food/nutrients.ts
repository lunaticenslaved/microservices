import z from 'zod/v4';

export type Nutrients = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  fibers: number;
};

export const NutrientsSchema = z.object({
  calories: z.number().gte(0),
  proteins: z.number().gte(0),
  fats: z.number().gte(0),
  carbs: z.number().gte(0),
  fibers: z.number().gte(0),
}) satisfies z.ZodType<Nutrients>;

export function multiplyNutrients(arg: {
  nutrients: Partial<Omit<Nutrients, 'id'>>;
  grams: number;
}): Nutrients {
  return {
    calories: (arg.nutrients.calories ?? 0) * arg.grams,
    proteins: (arg.nutrients.proteins ?? 0) * arg.grams,
    fats: (arg.nutrients.fats ?? 0) * arg.grams,
    carbs: (arg.nutrients.carbs ?? 0) * arg.grams,
    fibers: (arg.nutrients.fibers ?? 0) * arg.grams,
  };
}
