import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Gateway } from '@libs/gateway';
import { Database } from '#/db';

export default App.addCommand<
  Gateway.Food.Product.FindFirstRequest,
  Gateway.Food.Product.FindFirstResponse,
  Gateway.Food.Product.FindFirstExceptions
>('food/product/find-first', {
  validator: z.object({
    id: Components.Product.DeleteOneSchema.shape.id,
  }),
  handler: async ({ data }, { user }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const found = await Components.Product.findFirst_DTO(
        { id: data.id, userId: user.id },
        { trx },
      );

      return Gateway.createResponse({
        status: 200,
        data: found,
      });
    });
  },
});
