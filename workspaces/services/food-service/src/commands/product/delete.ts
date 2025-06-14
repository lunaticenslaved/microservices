import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Domain, Gateway } from '@libs/gateway';

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
      const found = await Components.Product.findFirst(
        {
          id: data.id,
          userId,
        },
        { trx },
      );

      if (!found) {
        return Domain.Food.createProductNotFoundException({ id: data.id });
      }

      const deleteResult = await Components.Product.deleteOne(
        { id: found.id, userId },
        { trx },
      );

      if (!deleteResult.success) {
        return deleteResult.error;
      }

      await Components.Nutrients.deleteMany({ ids: [found.nutrientsId] }, { trx });

      return Gateway.createResponse({
        status: 200,
        data: undefined,
      });
    });
  },
});
