import { App } from '#/app';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodMeal, FoodProduct } from '@libs/gateway';

export default App.addCommand({
  command: 'food/meal/create',
  validator: z.object({
    datetime: z.iso.datetime().optional(),
    productId: z.uuid(),
    grams: z.number().gt(0),
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const product = await trx.product.findFirst({
        where: {
          id: data.productId,
        },
        select: {
          id: true,
        },
      });

      if (!product) {
        return new FoodProduct.NotFoundException({ id: data.productId });
      }

      const existingMeal = await trx.meal.findFirst({
        where: {
          productId: data.productId,
          datetime: new Date(),
          userId: user.id,
        },
      });

      if (existingMeal) {
        return new FoodMeal.ProductInDatetimeExistsException({
          productId: data.productId,
        });
      }

      const created = await trx.meal.create({
        data: {
          userId: user.id,
          productId: data.productId,
          grams: data.grams,
          datetime: data.datetime,
        },
        select: {
          id: true,
          datetime: true,
          productId: true,
          grams: true,
        },
      });

      return {
        success: true,
        status: 201,
        data: {
          id: created.id,
          datetime: created.datetime.toISOString(),
          productId: created.productId,
          grams: created.grams,
        },
      };
    });
  },
});
