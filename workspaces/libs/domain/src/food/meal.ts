import z from 'zod/v4';
import { groupBy, orderBy } from 'lodash';
import { dayjs } from '../dayjs';
import { Dayjs } from 'dayjs';

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

export type MealGroup = {
  date: Dayjs;
  mealsForDate: Meal[][];
};

export function groupMeals(meals: Meal[]): MealGroup[] {
  const result: MealGroup[] = [];

  const prepared = orderBy(
    Object.entries(groupBy(meals, meal => dayjs(meal.datetime).format('L'))),
    ([date]) => dayjs(date).unix(),
    'asc',
  ).map(
    ([date, meals]) =>
      [date, orderBy(meals, meal => dayjs(meal.datetime).second(), 'asc')] as const,
  );

  for (const [date, meals] of prepared) {
    const mealByDate: Meal[][] = [];
    let prevMealtime: Dayjs | null = null;

    for (const meal of meals) {
      if (!prevMealtime || dayjs(meal.datetime).diff(prevMealtime, 'hour') > 1) {
        mealByDate.push([meal]);
      } else {
        mealByDate[0].push(meal);
      }

      prevMealtime = dayjs(meal.datetime);
    }

    result.push({ date: dayjs(date).startOf('date'), mealsForDate: mealByDate });
  }

  return result;
}
