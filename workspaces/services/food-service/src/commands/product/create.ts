import { App } from '#/app';
import { Components } from '#/components';
import z from 'zod/v4';
import { Database } from '#/db';
import { FoodDomain } from '@libs/domain';

const { ProductSchema, NutrientsSchema } = FoodDomain;

export default App.addCommand({
  command: 'food/product/create',
  validator: z.object({
    name: ProductSchema.shape.name,
    nutrients: z
      .object({
        calories: NutrientsSchema.shape.calories.optional(),
        proteins: NutrientsSchema.shape.proteins.optional(),
        fats: NutrientsSchema.shape.fats.optional(),
        carbs: NutrientsSchema.shape.carbs.optional(),
        fibers: NutrientsSchema.shape.fibers.optional(),
      })
      .optional(),
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
          where: { id: { in: [createdResult.data.id] } },
        },
        {
          trx,
          user,
        },
      );

      return {
        success: true,
        status: 201,
        data: created,
      };
    });
  },
});
