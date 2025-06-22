import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Gateway } from '@libs/gateway';
import { Database } from '#/db';

export default App.addCommand<
  Gateway.Food.Product.DeleteRequest,
  Gateway.Food.Product.DeleteResponse,
  Gateway.Food.Product.DeleteExceptions
>('food/product/delete', {
  validator: z.object({
    id: Components.Product.DeleteOneSchema.shape.id,
  }),
  handler: async ({ data }, { user }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const found = await Components.Product.findFirst(
        {
          id: data.id,
          userId: user.id,
        },
        { trx },
      );

      if (!found) {
        return Gateway.Food.Product.createNotFoundException({ id: data.id });
      }

      const deleteResult = await Components.Product.deleteOne(
        { id: found.id, userId: user.id },
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
