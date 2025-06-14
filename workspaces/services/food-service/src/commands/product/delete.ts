import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Domain, Gateway } from '@libs/gateway';
import { nonReachable } from '#/utils';

export default App.addCommand<
  Gateway.Food.Product.DeleteRequest,
  Gateway.Food.Product.DeleteResponse,
  Gateway.Food.Product.DeleteExceptions
>('product/delete', {
  validator: z.object({
    id: Components.Product.DeleteOneSchema.shape.id,
  }),
  handler: async ({ data }, { prisma, userId }) => {
    return prisma.$noThrowTransaction(async trx => {
      const deleteResult = await Components.Product.deleteMany(
        { ids: [data.id], userId },
        { trx },
      );

      if (!deleteResult.success) {
        nonReachable(deleteResult.success);
      }

      if (deleteResult.data.count === 0) {
        return Domain.Food.createProductNotFoundException(data);
      }

      return Gateway.createResponse({ status: 200, data: undefined });
    });
  },
});
