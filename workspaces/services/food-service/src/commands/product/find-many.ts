import { App } from '#/app';
import { Components } from '#/components';
import { Database } from '#/db';
import { FoodProduct, SuccessResponse } from '@libs/gateway';

export default App.addCommand({
  command: 'food/product/find-many',
  validator: FoodProduct.Config.getFindManyValidator(),
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

      return new SuccessResponse({
        status: 200,
        data: {
          items,
        },
      });
    });
  },
});
