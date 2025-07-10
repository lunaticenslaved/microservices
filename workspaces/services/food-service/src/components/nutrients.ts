import { z } from 'zod/v4';
import { PrismaTransaction } from '#/db';
import { FoodDomain } from '@libs/domain';
import { ServiceUtils } from '@libs/service-utils';
import { RequestValidationException } from '@libs/gateway';
import { Result } from '@libs/common';

// CREATE NUTRIENTS ------------------------------------------------------------------------
export type CreateRequest = z.infer<typeof CreateSchema>;
export const CreateSchema = z
  .object({
    calories: FoodDomain.NutrientsSchema.shape.calories.optional(),
    proteins: FoodDomain.NutrientsSchema.shape.proteins.optional(),
    fats: FoodDomain.NutrientsSchema.shape.fats.optional(),
    carbs: FoodDomain.NutrientsSchema.shape.carbs.optional(),
    fibers: FoodDomain.NutrientsSchema.shape.fibers.optional(),
  })
  .optional();
export async function create(
  data: CreateRequest,
  context: { trx: PrismaTransaction },
): Promise<Result<{ id: string }, RequestValidationException>> {
  const parsed = z.safeParse(CreateSchema, data);

  if (!parsed.success) {
    return Result.error(new RequestValidationException({ issues: parsed.error.issues }));
  }

  const { id } = await context.trx.nutrients.create({
    data: {
      calories: parsed.data?.calories ? parsed.data.calories : undefined,
      proteins: parsed.data?.proteins ? parsed.data.proteins : undefined,
      fats: parsed.data?.fats ? parsed.data.fats : undefined,
      carbs: parsed.data?.carbs ? parsed.data.carbs : undefined,
      fibers: parsed.data?.fibers ? parsed.data.fibers : undefined,
    },
    select: {
      id: true,
    },
  });

  return Result.success({ id });
}

// UPDATE NUTRIENTS ------------------------------------------------------------------------
export type UpdateRequest = z.infer<typeof UpdateSchema>;
export const UpdateSchema = z.object({
  id: z.uuid(),
  calories: ServiceUtils.numberUpdate
    .schema(FoodDomain.NutrientsSchema.shape.calories)
    .optional(),
  proteins: ServiceUtils.numberUpdate
    .schema(FoodDomain.NutrientsSchema.shape.proteins)
    .optional(),
  fats: ServiceUtils.numberUpdate
    .schema(FoodDomain.NutrientsSchema.shape.fats)
    .optional(),
  carbs: ServiceUtils.numberUpdate
    .schema(FoodDomain.NutrientsSchema.shape.carbs)
    .optional(),
  fibers: ServiceUtils.numberUpdate
    .schema(FoodDomain.NutrientsSchema.shape.fibers)
    .optional(),
});
export async function update(
  data: UpdateRequest,
  context: { trx: PrismaTransaction },
): Promise<Result<void, RequestValidationException>> {
  const parsed = z.safeParse(UpdateSchema, data);

  if (!parsed.success) {
    return {
      success: false,
      error: new RequestValidationException({ issues: parsed.error.issues }),
    };
  }

  await context.trx.nutrients.update({
    where: {
      id: data.id,
    },
    data: {
      calories: data.calories
        ? ServiceUtils.numberUpdate.prisma(data.calories)
        : undefined,
      proteins: data.proteins
        ? ServiceUtils.numberUpdate.prisma(data.proteins)
        : undefined,
      fats: data.fats ? ServiceUtils.numberUpdate.prisma(data.fats) : undefined,
      carbs: data.carbs ? ServiceUtils.numberUpdate.prisma(data.carbs) : undefined,
      fibers: data.fibers ? ServiceUtils.numberUpdate.prisma(data.fibers) : undefined,
    },
  });

  return {
    success: true,
    data: undefined,
  };
}

// DELETE MANY -----------------------------------------------------------------------------
export async function deleteMany(
  arg: { ids: string[] },
  context: { trx: PrismaTransaction },
) {
  const { count } = await context.trx.nutrients.deleteMany({
    where: {
      id: {
        in: arg.ids,
      },
    },
  });

  return { count };
}
