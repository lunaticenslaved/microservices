import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { nonReachable } from '#/utils';
import { Database } from '#/db';
import { SuccessResponse } from '@libs/gateway';

export default App.addCommand({
  command: 'food/product/find-many',
  validator: z.any(),
  handler: async ({ enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const listResult = await Components.Product.findMany_DTO(
        { userId: user.id },
        { trx },
      );

      if (!listResult.success) {
        nonReachable(listResult.success);
      }

      return new SuccessResponse({
        status: 200,
        data: {
          items: listResult.data,
        },
      });
    });
  },
});
