import { z } from 'zod/v4';
import { PrismaTransaction } from '#/db';
import { Gateway } from '@libs/gateway';
import { ServiceUtils } from '@libs/service';
import { Domain, Result, ResultSuccess } from '@libs/domain';

// CREATE NUTRIENTS ------------------------------------------------------------------------
export type CreateRequest = z.infer<typeof CreateSchema>;
export const CreateSchema = z
  .object({
    calories: ServiceUtils.numberCreate
      .schema(Domain.Food.NutrientsSchema.shape.calories)
      .optional(),
    proteins: ServiceUtils.numberCreate
      .schema(Domain.Food.NutrientsSchema.shape.proteins)
      .optional(),
    fats: ServiceUtils.numberCreate
      .schema(Domain.Food.NutrientsSchema.shape.fats)
      .optional(),
    carbs: ServiceUtils.numberCreate
      .schema(Domain.Food.NutrientsSchema.shape.carbs)
      .optional(),
    fibers: ServiceUtils.numberCreate
      .schema(Domain.Food.NutrientsSchema.shape.fibers)
      .optional(),
  })
  .optional();
export async function create(
  data: CreateRequest,
  context: { trx: PrismaTransaction },
): Promise<Result<{ id: string }, Gateway.RequestValidationException>> {
  const parsed = z.safeParse(CreateSchema, data);

  if (!parsed.success) {
    return {
      success: false,
      error: Gateway.createRequestValidationException({
        issues: parsed.error.issues,
      }),
    };
  }

  const { id } = await context.trx.nutrients.create({
    data: {
      calories: parsed.data?.calories
        ? ServiceUtils.numberCreate.prisma(parsed.data.calories)
        : undefined,
      proteins: parsed.data?.proteins
        ? ServiceUtils.numberCreate.prisma(parsed.data.proteins)
        : undefined,
      fats: parsed.data?.fats
        ? ServiceUtils.numberCreate.prisma(parsed.data.fats)
        : undefined,
      carbs: parsed.data?.carbs
        ? ServiceUtils.numberCreate.prisma(parsed.data.carbs)
        : undefined,
      fibers: parsed.data?.fibers
        ? ServiceUtils.numberCreate.prisma(parsed.data.fibers)
        : undefined,
    },
    select: {
      id: true,
    },
  });

  return {
    success: true,
    data: {
      id,
    },
  };
}

// UPDATE NUTRIENTS ------------------------------------------------------------------------
export type UpdateRequest = z.infer<typeof UpdateSchema>;
export const UpdateSchema = z.object({
  id: z.uuid(),
  calories: ServiceUtils.numberUpdate
    .schema(Domain.Food.NutrientsSchema.shape.calories)
    .optional(),
  proteins: ServiceUtils.numberUpdate
    .schema(Domain.Food.NutrientsSchema.shape.proteins)
    .optional(),
  fats: ServiceUtils.numberUpdate
    .schema(Domain.Food.NutrientsSchema.shape.fats)
    .optional(),
  carbs: ServiceUtils.numberUpdate
    .schema(Domain.Food.NutrientsSchema.shape.carbs)
    .optional(),
  fibers: ServiceUtils.numberUpdate
    .schema(Domain.Food.NutrientsSchema.shape.fibers)
    .optional(),
});
export async function update(
  data: UpdateRequest,
  context: { trx: PrismaTransaction },
): Promise<Result<void, Gateway.RequestValidationException>> {
  const parsed = z.safeParse(UpdateSchema, data);

  if (!parsed.success) {
    return {
      success: false,
      error: Gateway.createRequestValidationException({
        issues: parsed.error.issues,
      }),
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
export type DeleteManyRequest = z.infer<typeof DeleteManySchema>;
export const DeleteManySchema = z.object({
  ids: z.array(Domain.Food.NutrientsSchema.shape.id),
});
export async function deleteMany(
  arg: DeleteManyRequest,
  context: { trx: PrismaTransaction },
): Promise<ResultSuccess<{ count: number }>> {
  const { count } = await context.trx.nutrients.deleteMany({
    where: {
      id: {
        in: arg.ids,
      },
    },
  });

  return Result.success({ count });
}
