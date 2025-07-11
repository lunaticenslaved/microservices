import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodService } from '@libs/gateway';
import { createNumberUpdateSchema } from '@libs/service-utils';
import { FoodDomain } from '@libs/domain';

const { ProductSchema, NutrientsSchema } = FoodDomain;

App.addCommand({
  command: 'food/product/update',
  validator: z.object({
    id: ProductSchema.shape.id,
    name: ProductSchema.shape.name.optional(),
    nutrients: z.object({
      calories: createNumberUpdateSchema(NutrientsSchema.shape.calories).optional(),
      proteins: createNumberUpdateSchema(NutrientsSchema.shape.proteins).optional(),
      fats: createNumberUpdateSchema(NutrientsSchema.shape.fats).optional(),
      carbs: createNumberUpdateSchema(NutrientsSchema.shape.carbs).optional(),
      fibers: createNumberUpdateSchema(NutrientsSchema.shape.fibers).optional(),
    }),
  }),
  handler: async ({ data, enrichments: { user } }) => {
    return await Database.prisma.$noThrowTransaction(async trx => {
      const [product] = await Components.Product.findMany(
        {
          where: { id: { in: [data.id] } },
        },
        {
          trx,
          user,
        },
      );

      if (!product) {
        return new FoodService.ProductNotFoundException({ id: data.id });
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
        { where: { id: { in: [data.id] } } },
        { trx, user },
      );

      return {
        success: true,
        status: 200,
        data: updated,
      };
    });
  },
});
