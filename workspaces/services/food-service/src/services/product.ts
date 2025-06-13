import z from 'zod/v4';
import { PrismaTransaction } from '../prisma';
import { ServiceUtils, Domain, Result, Gateway } from '@libs/gateway';
import { Schemas } from '#/schemas';

// CHECK IF NAME UNIQUE -----------------------------------------------------------------
async function checkIfNameUnique(
  arg: { name: string },
  context: { trx: PrismaTransaction },
): Promise<{ unique: boolean }> {
  const found = await context.trx.food_Product.findFirst({
    where: {
      name: arg.name,
    },
    select: {
      id: true,
    },
  });

  return {
    unique: !found,
  };
}

// FIND FIRST PRODUCT --------------------------------------------------------------------------
export type FindFirstRequest = z.infer<typeof FindFirstSchema>;
export const FindFirstSchema = Schemas.Product.pick({ id: true });
export async function findFirst_DTO(
  arg: FindFirstRequest,
  context: { trx: PrismaTransaction },
): Promise<Domain.Food.Product | null> {
  return await context.trx.food_Product.findFirst({
    where: {
      id: arg.id,
    },
    select: {
      id: true,
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
}

// CREATE PRODUCT ----------------------------------------------------------------------
export type CreateRequest = z.infer<typeof CreateSchema>;
export const CreateSchema = z.object({
  nutrientsId: Schemas.Product.shape.nutrientsId,
  name: ServiceUtils.stringUpdate.schema(Schemas.Product.shape.name),
});
export async function create(
  arg: CreateRequest,
  context: { trx: PrismaTransaction },
): Promise<Result<{ id: string }, Domain.Food.ProductException.NameNotUnique>> {
  const name = arg.name.value;

  const { unique } = await checkIfNameUnique({ name }, context);

  if (!unique) {
    return Result.error(Domain.Food.ProductException.createNameNotUnique({ name }));
  }

  const created = await context.trx.food_Product.create({
    data: {
      nutrientsId: arg.nutrientsId,
      name: ServiceUtils.stringCreate.prisma(arg.name),
    },
    select: {
      id: true,
    },
  });

  return Result.success(created);
}

// UPDATE PRODUCT ----------------------------------------------------------------------
export type UpdateRequest = z.infer<typeof UpdateSchema>;
export const UpdateSchema = z.object({
  id: Schemas.Product.shape.id,
  name: ServiceUtils.stringUpdate.schema(Schemas.Product.shape.name),
});
export async function update(
  arg: UpdateRequest,
  context: { trx: PrismaTransaction },
): Promise<
  Result<
    null,
    Domain.Food.ProductException.NameNotUnique | Gateway.RequestValidationException
  >
> {
  const parsed = z.safeParse(UpdateSchema, arg);

  if (!parsed.success) {
    return Result.error(
      Gateway.createRequestValidationException({ issues: parsed.error.issues }),
    );
  }

  // Check if name is unique
  const name = arg.name.value;
  const { unique } = await checkIfNameUnique({ name }, context);
  if (!unique) {
    return Result.error(Domain.Food.ProductException.createNameNotUnique({ name }));
  }

  // Update product
  await context.trx.food_Product.update({
    where: {
      id: arg.id,
    },
    data: {
      name: ServiceUtils.stringUpdate.prisma(arg.name),
    },
  });

  return Result.success(null);
}
