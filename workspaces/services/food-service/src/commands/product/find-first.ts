import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodService, SuccessResponse } from '@libs/gateway';

export default App.addCommand<FoodService.Product.FindFirstCommand>({
  command: 'food/product/find-first',
  validator: z.object({
    id: Components.Product.DeleteOneSchema.shape.id,
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const found = await Components.Product.findFirst_DTO(
        { id: data.id, userId: user.id },
        { trx },
      );

      if (!found) {
        return new FoodService.Product.NotFoundException(data);
      }

      return new SuccessResponse({
        status: 200,
        data: found,
      });
    });
  },
});
