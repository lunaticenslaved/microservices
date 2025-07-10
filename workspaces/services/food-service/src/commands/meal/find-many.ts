import { App } from '#/app';
import { Database } from '#/db';
import { FoodMeal } from '@libs/gateway';

export default App.addCommand({
  command: 'food/meal/find-many',
  validator: FoodMeal.EntityConfig.getFindManyValidator(),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const items = await trx.meal.findMany({
        where: {
          ...data.where,
          userId: user.id,
        },
        select: {
          id: true,
          datetime: true,
          grams: true,
          productId: true,
        },
      });

      return {
        success: true,
        status: 200,
        data: {
          items: items.map(item => {
            return {
              id: item.id,
              grams: item.grams,
              productId: item.productId,
              datetime: item.datetime.toISOString(),
            };
          }),
        },
      };
    });
  },
});
