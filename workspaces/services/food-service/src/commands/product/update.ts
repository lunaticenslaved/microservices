import { App } from '#/app';
import { Errors } from '#/errors';
import { Command } from '@libs/types';
import { Models } from '#/models';
import { Services } from '#/services';
import z from 'zod/v4';

export type UpdateRequest = Command.IRequest<{
  id: string;
  name?: {
    set: string;
  };
  nutrients: Pick<
    Services.Nutrients.UpdateRequest,
    'calories' | 'carbs' | 'fats' | 'fibers' | 'proteins'
  >;
}>;

export type UpdateResponse = Command.IResponse<Models.Product>;

export type UpdateErrors = ReturnType<typeof Errors.Product.createProductNotFoundError>;

App.addCommand<UpdateRequest, UpdateResponse>('product/update', {
  handler: async ({ data }, { prisma }) => {
    const updated = await prisma.$transaction(async trx => {
      const product = await trx.food_Product.findFirst({
        where: {
          id: data.id,
        },
      });

      if (!product) {
        throw Errors.Product.createProductNotFoundError({ id: data.id });
      }

      await Services.Nutrients.update(
        {
          id: product.nutrientsId,
          ...data.nutrients,
        },
        {
          trx,
        },
      );

      return Services.Product.get({ id: data.id }, { trx });
    });

    return {
      success: true,
      status: 200,
      data: updated,
    };
  },
  validator: z.object({
    id: z.uuid(),
    name: z
      .object({
        set: z.string(),
      })
      .optional(),
    nutrients: Services.Nutrients.UpdateSchema.pick({
      calories: true,
      carbs: true,
      fats: true,
      fibers: true,
      proteins: true,
    }),
  }),
});
