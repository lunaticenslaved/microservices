import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Domain, Gateway } from '@libs/gateway';

export default App.addCommand<
  Gateway.Food.Product.GetRequest,
  Gateway.Food.Product.GetResponse,
  Gateway.Food.Product.GetExceptions
>('product/get', {
  validator: z.object({
    id: Components.Product.DeleteOneSchema.shape.id,
  }),
  handler: async ({ data }, { prisma, userId }) => {
    return prisma.$noThrowTransaction(async trx => {
      const found = await Components.Product.findFirst_DTO(
        { id: data.id, userId },
        { trx },
      );

      if (!found) {
        return Gateway.createException(Domain.Food.createProductNotFoundException(data));
      }

      return Gateway.createResponse({
        status: 200,
        data: found,
      });
    });
  },
});
