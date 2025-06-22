import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Gateway } from '@libs/gateway';
import { nonReachable } from '#/utils';
import { Database } from '#/db';

export default App.addCommand<Gateway.Food.Product.FindManyCommand>(
  'food/product/find-many',
  {
    validator: z.unknown(),
    handler: async (_, { user }) => {
      return Database.prisma.$noThrowTransaction(async trx => {
        const listResult = await Components.Product.findMany_DTO(
          { userId: user.id },
          { trx },
        );

        if (!listResult.success) {
          nonReachable(listResult.success);
        }

        return Gateway.createResponse({
          status: 200,
          data: {
            items: listResult.data,
          },
        });
      });
    },
  },
);
