import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodProduct, SuccessResponse } from '@libs/gateway';

export default App.addCommand({
  command: 'food/product/find-first',
  validator: z.object({
    id: z.string(),
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const [found] = await Components.Product.findMany_DTO(
        {
          id: { in: [data.id] },
        },
        {
          trx,
          user,
        },
      );

      if (!found) {
        return new FoodProduct.NotFoundException(data);
      }

      return new SuccessResponse({
        status: 200,
        data: found,
      });
    });
  },
});
