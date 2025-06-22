import z from 'zod/v4';
import { PrismaTransaction } from '#/db';
import { Gateway } from '@libs/gateway';
import { ServiceUtils } from '@libs/service';
import { Domain, Result, ResultSuccess } from '@libs/domain';

const DTO_SELECT = {
  id: true,
  name: true,
  nutrients: {
    select: {
      calories: true,
      proteins: true,
      carbs: true,
      fats: true,
      fibers: true,
    },
  },
};

// CHECK IF NAME UNIQUE -----------------------------------------------------------------
async function checkIfNameUnique(
  arg: { name: string },
  context: { trx: PrismaTransaction },
): Promise<{ unique: boolean }> {
  const found = await context.trx.product.findFirst({
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

// FIND FIRST PRODUCT -------------------------------------------------------------------
export type FindFirstRequest = z.infer<typeof FindFirstSchema>;
export const FindFirstSchema = z.union([
  z.object({
    id: Domain.Food.ProductSchema.shape.id,
    userId: Domain.Food.ProductSchema.shape.userId,
  }),
  z.object({
    name: Domain.Food.ProductSchema.shape.name,
    userId: Domain.Food.ProductSchema.shape.userId,
  }),
]);
export async function findFirst_DTO(
  arg: FindFirstRequest,
  context: { trx: PrismaTransaction },
): Promise<Gateway.Food.Product.DTO | null> {
  if ('id' in arg) {
    return await context.trx.product.findFirst({
      select: DTO_SELECT,
      where: {
        id: arg.id,
        userId: arg.userId,
      },
    });
  }

  return await context.trx.product.findFirst({
    select: DTO_SELECT,
    where: {
      name: arg.name,
      userId: arg.userId,
    },
  });
}
export async function findFirst(
  arg: FindFirstRequest,
  context: { trx: PrismaTransaction },
): Promise<Domain.Food.Product | null> {
  const select = {
    id: true,
    name: true,
    nutrientsId: true,
    userId: true,
  };

  if ('id' in arg) {
    return await context.trx.product.findFirst({
      select,
      where: {
        id: arg.id,
        userId: arg.userId,
      },
    });
  }

  return await context.trx.product.findFirst({
    select,
    where: {
      name: arg.name,
      userId: arg.userId,
    },
  });
}

// FIND MANY PRODUCTS
export type FindManyRequest = z.infer<typeof FindManySchema>;
export const FindManySchema = z.object({
  userId: Domain.Food.ProductSchema.shape.userId,
});
export async function findMany_DTO(
  arg: FindManyRequest,
  context: { trx: PrismaTransaction },
): Promise<ResultSuccess<Gateway.Food.Product.DTO[]>> {
  const items = await context.trx.product.findMany({
    select: DTO_SELECT,
    where: {
      userId: arg.userId,
    },
  });

  return Result.success(items);
}

// CREATE PRODUCT ----------------------------------------------------------------------
export type CreateRequest = z.infer<typeof CreateSchema>;
export const CreateSchema = z.object({
  userId: Domain.Food.ProductSchema.shape.userId,
  nutrientsId: Domain.Food.ProductSchema.shape.nutrientsId,
  name: ServiceUtils.stringCreate.schema(Domain.Food.ProductSchema.shape.name),
});
export async function create(
  arg: CreateRequest,
  context: { trx: PrismaTransaction },
): Promise<Result<{ id: string }, Gateway.Food.Product.NameNotUniqueException>> {
  const name = arg.name.value;

  const { unique } = await checkIfNameUnique({ name }, context);

  if (!unique) {
    return Result.error(Gateway.Food.Product.createNameNotUniqueException({ name }));
  }

  const created = await context.trx.product.create({
    data: {
      userId: arg.userId,
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
  id: Domain.Food.ProductSchema.shape.id,
  name: ServiceUtils.stringUpdate.schema(Domain.Food.ProductSchema.shape.name),
});
export async function update(
  arg: UpdateRequest,
  context: { trx: PrismaTransaction },
): Promise<
  Result<
    null,
    Gateway.Food.Product.NameNotUniqueException | Gateway.RequestValidationException
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
    return Result.error(Gateway.Food.Product.createNameNotUniqueException({ name }));
  }

  // Update product
  await context.trx.product.update({
    where: {
      id: arg.id,
    },
    data: {
      name: ServiceUtils.stringUpdate.prisma(arg.name),
    },
  });

  return Result.success(null);
}

// DELETE PRODUCT ----------------------------------------------------------------------
export type DeleteOneRequest = z.infer<typeof DeleteOneSchema>;
export const DeleteOneSchema = z.object({
  id: Domain.Food.ProductSchema.shape.id,
  userId: Domain.Food.ProductSchema.shape.userId,
});
export async function deleteOne(
  arg: DeleteOneRequest,
  context: { trx: PrismaTransaction },
): Promise<Result<void, Gateway.Food.Product.NotFoundException>> {
  const found = await findFirst(arg, context);

  if (!found) {
    return Result.error(Gateway.Food.Product.createNotFoundException(arg));
  }

  return Result.success(undefined);
}

// DELETE MANY PRODUCTS ----------------------------------------------------------------------
export type DeleteManyRequest = z.infer<typeof DeleteManySchema>;
export const DeleteManySchema = z.object({
  ids: z.array(Domain.Food.ProductSchema.shape.id),
  userId: Domain.Food.ProductSchema.shape.userId,
});
export async function deleteMany(
  arg: DeleteManyRequest,
  context: { trx: PrismaTransaction },
): Promise<ResultSuccess<{ count: number }>> {
  const { count } = await context.trx.product.deleteMany({
    where: {
      id: { in: arg.ids },
      userId: arg.userId,
    },
  });

  return Result.success({ count });
}
