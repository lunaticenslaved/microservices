import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodService, SuccessResponse } from '@libs/gateway';

App.addCommand<FoodService.Product.UpdateCommand>({
  command: 'food/product/update',
  handler: async ({ data, enrichments: { user } }) => {
    return await Database.prisma.$noThrowTransaction(async trx => {
      const product = await Components.Product.findFirst(
        { id: data.id, userId: user.id },
        { trx },
      );

      if (!product) {
        return new FoodService.Product.NotFoundException({ id: data.id });
      }

      if (data.name) {
        await Components.Product.update({ id: product.id, name: data.name }, { trx });
      }

      await Components.Nutrients.update(
        { id: product.nutrientsId, ...data.nutrients },
        { trx },
      );

      const updated = await Components.Product.findFirst_DTO(
        { id: data.id, userId: user.id },
        { trx },
      );

      if (!updated) {
        // Cannot be here
        throw new Error('Product not found!');
      }

      return new SuccessResponse({
        status: 200,
        data: updated,
      });
    });
  },
  validator: z.object({
    id: Components.Product.UpdateSchema.shape.id,
    name: Components.Product.UpdateSchema.shape.name,
    nutrients: Components.Nutrients.UpdateSchema,
  }),
});
