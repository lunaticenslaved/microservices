import { z } from 'zod/v4';
import { PrismaTransaction } from '../prisma';
import { ServiceUtils, Gateway, Result } from '@libs/gateway';

// TODO move validation to domain

// CREATE NUTRIENTS ------------------------------------------------------------------------
export type CreateRequest = z.infer<typeof CreateSchema>;
export const CreateSchema = z
  .object({
    calories: ServiceUtils.numberCreate.schema(z.number().gte(0)).optional(),
    proteins: ServiceUtils.numberCreate.schema(z.number().gte(0)).optional(),
    fats: ServiceUtils.numberCreate.schema(z.number().gte(0)).optional(),
    carbs: ServiceUtils.numberCreate.schema(z.number().gte(0)).optional(),
    fibers: ServiceUtils.numberCreate.schema(z.number().gte(0)).optional(),
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

  const { id } = await context.trx.food_Nutrients.create({
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

// UPDATE NUTRIENTS ---------------------------------------------------------------------------------
export type UpdateRequest = z.infer<typeof UpdateSchema>;
export const UpdateSchema = z.object({
  id: z.uuid(),
  calories: ServiceUtils.numberUpdate.schema(z.number().gte(0)).optional(),
  proteins: ServiceUtils.numberUpdate.schema(z.number().gte(0)).optional(),
  fats: ServiceUtils.numberUpdate.schema(z.number().gte(0)).optional(),
  carbs: ServiceUtils.numberUpdate.schema(z.number().gte(0)).optional(),
  fibers: ServiceUtils.numberUpdate.schema(z.number().gte(0)).optional(),
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

  await context.trx.food_Nutrients.update({
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
