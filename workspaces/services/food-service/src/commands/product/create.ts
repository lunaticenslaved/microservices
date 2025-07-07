import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { SuccessResponse } from '@libs/gateway';
import { NutrientsSchema, ProductSchema } from '@libs/domain/food';

export default App.addCommand({
  command: 'food/product/create',
  validator: z.object({
    name: ProductSchema.shape.name,
    nutrients: NutrientsSchema.pick({
      proteins: true,
      calories: true,
      carbs: true,
      fats: true,
      fibers: true,
    }).partial(),
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const nutrientsResult = await Components.Nutrients.create(data.nutrients, {
        trx,
      });

      if (!nutrientsResult.success) {
        return nutrientsResult.error;
      }

      const createdResult = await Components.Product.create(
        {
          name: data.name,
          nutrientsId: nutrientsResult.data.id,
        },
        {
          trx,
          user,
        },
      );

      if (!createdResult.success) {
        return createdResult.error;
      }

      const [created] = await Components.Product.findMany_DTO(
        {
          id: { in: [createdResult.data.id] },
        },
        {
          trx,
          user,
        },
      );

      return new SuccessResponse({
        status: 201,
        data: created,
      });
    });
  },
});
