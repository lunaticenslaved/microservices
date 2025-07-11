import { App } from '#/app';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodService } from '@libs/gateway';

export default App.addCommand({
  command: 'food/meal/delete',
  validator: z.object({
    id: z.uuid(),
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const foundMeal = await trx.meal.findFirst({
        where: {
          id: data.id,
        },
        select: {
          id: true,
        },
      });

      if (!foundMeal) {
        return new FoodService.MealNotFoundException({ id: data.id });
      }

      await trx.meal.delete({
        where: {
          id: data.id,
          userId: user.id,
        },
      });

      return {
        success: true,
        status: 200,
        data: null,
      };
    });
  },
});
