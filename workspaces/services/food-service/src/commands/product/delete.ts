import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodService, SuccessResponse } from '@libs/gateway';

export default App.addCommand<FoodService.Product.DeleteCommand>({
  command: 'food/product/delete',
  validator: z.object({
    id: Components.Product.DeleteOneSchema.shape.id,
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const found = await Components.Product.findFirst(
        {
          id: data.id,
          userId: user.id,
        },
        { trx },
      );

      if (!found) {
        return new FoodService.Product.NotFoundException({ id: data.id });
      }

      const deleteResult = await Components.Product.deleteOne(
        { id: found.id, userId: user.id },
        { trx },
      );

      if (!deleteResult.success) {
        return deleteResult.error;
      }

      await Components.Nutrients.deleteMany({ ids: [found.nutrientsId] }, { trx });

      return new SuccessResponse({
        status: 200,
        data: undefined,
      });
    });
  },
});
