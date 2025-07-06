import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { SuccessResponse, FoodService } from '@libs/gateway';

export default App.addCommand<FoodService.Product.CreateCommand>({
  command: 'food/product/create',
  validator: z.object({
    name: Components.Product.CreateSchema.shape.name,
    nutrients: Components.Nutrients.CreateSchema,
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const nutrientsResult = await Components.Nutrients.create(data.nutrients, {
        trx,
      });

      if (!nutrientsResult.success) {
        return nutrientsResult.error;
      }

      const createResult = await Components.Product.create(
        {
          userId: user.id,
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
      const created = await Components.Product.findFirst_DTO(
        { id: productId, userId: user.id },
        { trx },
      );

      if (!created) {
        // Cannot be here
        throw new Error('Product not found!');
      }

      return new SuccessResponse({
        status: 201,
        data: created,
      });
    });
  },
});
