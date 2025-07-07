import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { SuccessResponse } from '@libs/gateway';

export default App.addCommand({
  command: 'food/product/find-many',
  validator: z.object({
    id: z.object({ in: z.array(z.string()) }),
  }),
  handler: async ({ data: { id }, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const items = await Components.Product.findMany_DTO(
        {
          id,
        },
        {
          trx,
          user,
        },
      );

      return new SuccessResponse({
        status: 200,
        data: {
          items,
        },
      });
    });
  },
});
