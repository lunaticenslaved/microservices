import { Errors } from '#/errors';
import { App } from '#/app';
import { Models } from '#/models';
import { Services } from '#/services';
import { Command } from '@libs/types';
import z from 'zod/v4';

export type CreateRequest = Command.IRequest<{
  name: string;
  nutrients: {
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
    fibers: number;
  };
}>;

export type CreateResponse = Command.IResponse<Models.Product>;

export type CreateErrors = ReturnType<typeof Errors.Product.createNameNotUniqueError>;

export default App.addCommand<CreateRequest, CreateResponse>({
  command: 'product/create',
  validator: z.object({
    name: z.string().max(255).trim(),
    nutrients: z.object({
      calories: z.coerce
        .number()
        .gte(0)
        .transform(val => Math.min(val, 0)),
      proteins: z.coerce
        .number()
        .gte(0)
        .transform(val => Math.min(val, 0)),
      fats: z.coerce
        .number()
        .gte(0)
        .transform(val => Math.min(val, 0)),
      carbs: z.coerce
        .number()
        .gte(0)
        .transform(val => Math.min(val, 0)),
      fibers: z.coerce
        .number()
        .gte(0)
        .transform(val => Math.min(val, 0)),
    }),
  }),
  handler: async ({ data }, { prisma }) => {
    const created = await prisma.$transaction(async trx => {
      const result = await Services.Product.checkIfNameUnique(data, trx);

      if (!result.unique) {
        throw Errors.Product.createNameNotUniqueError(data);
      }

      return await trx.food_Product.create({
        data: {
          name: data.name,
          nutrients: {
            create: data.nutrients,
          },
        },
        select: {
          name: true,
          nutrients: {
            select: {
              calories: true,
              proteins: true,
              fats: true,
              carbs: true,
              fibers: true,
            },
          },
        },
      });
    });

    return {
      success: true,
      status: 401,
      data: created,
    };
  },
});
