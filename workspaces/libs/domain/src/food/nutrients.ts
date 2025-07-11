import z from 'zod/v4';

export type Nutrients = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  fibers: number;
};

export function createEmptyNutrients(): Nutrients {
  return {
    calories: 0,
    carbs: 0,
    proteins: 0,
    fats: 0,
    fibers: 0,
  };
}

export const NutrientsSchema = z.object({
  calories: z.number().gte(0),
  proteins: z.number().gte(0),
  fats: z.number().gte(0),
  carbs: z.number().gte(0),
  fibers: z.number().gte(0),
}) satisfies z.ZodType<Nutrients>;

export function multiplyNutrients(arg: {
  num: number;
  nutrients: Partial<Nutrients>;
}): Nutrients {
  const nutrients: Partial<Nutrients> = arg.nutrients;

  return {
    calories: (nutrients.calories ?? 0) * arg.num,
    proteins: (nutrients.proteins ?? 0) * arg.num,
    fats: (nutrients.fats ?? 0) * arg.num,
    carbs: (nutrients.carbs ?? 0) * arg.num,
    fibers: (nutrients.fibers ?? 0) * arg.num,
  };
}

export function divideNutrients(arg: {
  num: number;
  nutrients: Partial<Nutrients>;
}): Nutrients {
  return {
    calories: (arg.nutrients.calories ?? 0) / arg.num,
    proteins: (arg.nutrients.proteins ?? 0) / arg.num,
    fats: (arg.nutrients.fats ?? 0) / arg.num,
    carbs: (arg.nutrients.carbs ?? 0) / arg.num,
    fibers: (arg.nutrients.fibers ?? 0) / arg.num,
  };
}

export function sumNutrients(items: Partial<Nutrients>[]): Nutrients {
  return items.reduce<Nutrients>((acc, item) => {
    return {
      calories: (acc.calories ?? 0) + (item.calories ?? 0),
      proteins: (acc.proteins ?? 0) + (item.proteins ?? 0),
      fats: (acc.fats ?? 0) + (item.fats ?? 0),
      carbs: (acc.carbs ?? 0) + (item.carbs ?? 0),
      fibers: (acc.fibers ?? 0) + (item.fibers ?? 0),
    };
  }, createEmptyNutrients());
}
