import { App } from '#/app';
import { Services } from '#/services';
import z from 'zod/v4';
import { Domain, Gateway } from '@libs/gateway';

App.addCommand<
  Gateway.Food.Product.UpdateRequest,
  Gateway.Food.Product.UpdateResponse,
  Gateway.Food.Product.UpdateErrors
>('product/update', {
  handler: async ({ data }, { prisma }) => {
    return await prisma.$transaction(async trx => {
      const product = await trx.food_Product.findFirst({
        where: {
          id: data.id,
        },
      });

      if (!product) {
        return Domain.Food.ProductException.createProductNotFound({ id: data.id });
      }

      // FIXME update name

      await Services.Nutrients.update(
        {
          id: product.nutrientsId,
          ...data.nutrients,
        },
        {
          trx,
        },
      );

      const updated = await Services.Product.findFirst_DTO({ id: data.id }, { trx });

      if (!updated) {
        // Cannot be here
        throw new Error('Product not found!');
      }

      return {
        success: true,
        status: 200,
        data: updated,
      };
    });
  },
  validator: z.object({
    id: Services.Product.UpdateSchema.shape.id,
    name: Services.Product.UpdateSchema.shape.name,
    nutrients: Services.Nutrients.UpdateSchema,
  }),
});
