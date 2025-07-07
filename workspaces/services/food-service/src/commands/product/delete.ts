import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodProduct, SuccessResponse } from '@libs/gateway';

export default App.addCommand({
  command: 'food/product/delete',
  validator: z.object({
    id: z.string(),
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const [found] = await Components.Product.findMany(
        {
          id: { in: [data.id] },
        },
        {
          trx,
          user,
        },
      );

      if (!found) {
        return new FoodProduct.NotFoundException({ id: data.id });
      }

      await Components.Product.deleteMany(
        { id: { in: [found.id] } },
        {
          trx,
          user,
        },
      );

      await Components.Nutrients.deleteMany({ ids: [found.nutrientsId] }, { trx });

      return new SuccessResponse({
        status: 200,
        data: undefined,
      });
    });
  },
});
