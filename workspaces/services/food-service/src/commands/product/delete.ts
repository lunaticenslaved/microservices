import { App } from '#/app';
import { Components } from '#/components';
import { Database } from '#/db';
import { FoodDomain } from '@libs/domain';
import { FoodProduct } from '@libs/gateway';
import z from 'zod/v4';

export default App.addCommand({
  command: 'food/product/delete',
  validator: z.object({
    id: FoodDomain.ProductSchema.shape.id,
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const [found] = await Components.Product.findMany(
        {
          where: { id: { in: [data.id] } },
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
        {
          where: { id: { in: [found.id] } },
        },
        {
          trx,
          user,
        },
      );

      await Components.Nutrients.deleteMany({ ids: [found.nutrientsId] }, { trx });

      return {
        success: true,
        status: 200,
        data: undefined,
      };
    });
  },
});
