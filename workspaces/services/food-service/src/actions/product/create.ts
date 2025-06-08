import { Action } from '#/app';
import { Errors } from '#/errors';
import { Models } from '#/models';
import { Service } from '#/services';
import z from 'zod/v4';

export type CreateRequest = Action.IRequest<{
  name: string;
  nutrients: {
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
    fibers: number;
  };
}>;

export type CreateResponse = Action.IResponse<Models.Product>;

export type CreateErrors = ReturnType<typeof Errors.Product.createNameNotUniqueError>;

export default Action.add<CreateRequest, CreateResponse>({
  action: 'product/create',
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
      const result = await Service.Product.checkIfNameUnique(data, trx);

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
