import { App } from '#/app';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodService } from '@libs/gateway';

export default App.addCommand({
  command: 'food/meal/update',
  validator: z.object({
    id: z.uuid(),
    datetime: z.iso.datetime().optional(),
    productId: z.uuid(),
    grams: z.number().gt(0),
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      if (data.productId) {
        const product = await trx.product.findFirst({
          where: {
            id: data.productId,
          },
          select: {
            id: true,
          },
        });

        if (!product) {
          return new FoodService.ProductNotFoundException({ id: data.productId });
        }
      }

      const updated = await trx.meal.update({
        where: {
          id: data.id,
          userId: user.id,
        },
        data: {
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
        status: 200,
        data: {
          id: updated.id,
          datetime: updated.datetime.toISOString(),
          productId: updated.productId,
          grams: updated.grams,
        },
      };
    });
  },
});
