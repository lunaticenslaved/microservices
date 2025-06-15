import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Gateway } from '@libs/gateway';

export default App.addCommand<
  Gateway.Food.Product.FindFirstRequest,
  Gateway.Food.Product.FindFirstResponse,
  Gateway.Food.Product.FindFirstExceptions
>('product/find-first', {
  validator: z.object({
    id: Components.Product.DeleteOneSchema.shape.id,
  }),
  handler: async ({ data }, { db, userId }) => {
    return db.Client.$noThrowTransaction(async trx => {
      const found = await Components.Product.findFirst_DTO(
        { id: data.id, userId },
        { trx },
      );

      return Gateway.createResponse({
        status: 200,
        data: found,
      });
    });
  },
});
