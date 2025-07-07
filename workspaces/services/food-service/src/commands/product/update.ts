import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodProduct, SuccessResponse } from '@libs/gateway';
import { ProductSchema } from '@libs/domain/food';

App.addCommand({
  command: 'food/product/update',
  validator: z.object({
    id: ProductSchema.shape.id,
    name: ProductSchema.shape.name,
    nutrients: Components.Nutrients.UpdateSchema,
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return await Database.prisma.$noThrowTransaction(async trx => {
      const [product] = await Components.Product.findMany(
        {
          id: { in: [data.id] },
        },
        {
          trx,
          user,
        },
      );

      if (!product) {
        return new FoodProduct.NotFoundException({ id: data.id });
      }

      if (data.name) {
        await Components.Product.update(
          {
            id: product.id,
            name: data.name,
          },
          {
            trx,
            user,
          },
        );
      }

      await Components.Nutrients.update(
        { id: product.nutrientsId, ...data.nutrients },
        { trx },
      );

      const [updated] = await Components.Product.findMany_DTO(
        { id: { in: [data.id] } },
        { trx, user },
      );

      return new SuccessResponse({
        status: 200,
        data: updated,
      });
    });
  },
});
