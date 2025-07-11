import { App } from '#/app';
import { Components } from '#/components';
import { Database } from '#/db';
import { FoodService } from '@libs/gateway';

export default App.addCommand({
  command: 'food/product/find-many',
  validator: FoodService.ProductEntityConfig.getFindManyValidator(),
  handler: async ({ data: { where }, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const items = await Components.Product.findMany_DTO(
        {
          where,
        },
        {
          trx,
          user,
        },
      );

      return {
        success: true,
        status: 200,
        data: {
          items,
        },
      };
    });
  },
});
