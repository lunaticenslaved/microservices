import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Gateway } from '@libs/gateway';
import { nonReachable } from '#/utils';

export default App.addCommand<
  Gateway.Food.Product.ListRequest,
  Gateway.Food.Product.ListResponse,
  Gateway.Food.Product.ListExceptions
>('product/list', {
  validator: z.unknown(),
  handler: async (_, { db, userId }) => {
    return db.Client.$noThrowTransaction(async trx => {
      const listResult = await Components.Product.findMany_DTO({ userId }, { trx });

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
});
