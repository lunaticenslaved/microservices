import { App } from '#/app';
import { Services } from '#/services';
import z from 'zod/v4';
import { Gateway } from '@libs/gateway';

export default App.addCommand<
  Gateway.Food.Product.CreateRequest,
  Gateway.Food.Product.CreateResponse,
  Gateway.Food.Product.CreateErrors
>('product/create', {
  validator: z.object({
    name: Services.Product.CreateSchema.shape.name,
    nutrients: Services.Nutrients.CreateSchema,
  }),
  handler: async ({ data }, { prisma }) => {
    return prisma.$transaction(async trx => {
      const nutrientsResult = await Services.Nutrients.create(data.nutrients, {
        trx,
      });

      if (!nutrientsResult.success) {
        return nutrientsResult.error;
      }

      const createResult = await Services.Product.create(
        {
          name: data.name,
          nutrientsId: nutrientsResult.data.id,
        },
        {
          trx,
        },
      );

      if (!createResult.success) {
        return createResult.error;
      }

      const productId = createResult.data.id;
      const created = await Services.Product.findFirst_DTO({ id: productId }, { trx });

      if (!created) {
        // Cannot be here
        throw new Error('Product not found!');
      }

      return {
        success: true,
        status: 201,
        data: created,
      };
    });
  },
});
