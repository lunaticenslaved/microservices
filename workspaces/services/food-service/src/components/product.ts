import { Result } from '@libs/common';
import { FoodProduct } from '@libs/gateway';

import { PrismaTransaction } from '#/db';

type ListFilter = {
  where?: {
    id?: { in: string[] };
    name?: {
      startsWith?: string;
      mode?: 'case-sensitive' | 'case-insensitive';
      in?: string[];
    };
  };
};

function listFilter(arg: ListFilter) {
  return {
    id: arg.where?.id,
    name: arg.where?.name
      ? {
          ...arg.where.name,
          mode:
            arg.where.name.mode === 'case-insensitive'
              ? ('insensitive' as const)
              : ('default' as const),
        }
      : undefined,
  };
}

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

type CallContext = {
  trx: PrismaTransaction;
  user: { id: string };
};

async function checkIfNameUnique(arg: { name: string }, context: CallContext) {
  const found = await context.trx.product.findFirst({
    where: {
      name: arg.name,
      userId: context.user.id,
    },
    select: {
      id: true,
    },
  });

  return !found;
}

export async function findMany_DTO(
  arg: ListFilter,
  context: CallContext,
): Promise<FoodProduct.DTO[]> {
  return await context.trx.product.findMany({
    select: DTO_SELECT,
    where: {
      ...listFilter(arg),
      userId: context.user.id,
    },
  });
}

export async function findMany(arg: ListFilter, context: CallContext) {
  return await context.trx.product.findMany({
    where: {
      ...listFilter(arg),
      userId: context.user.id,
    },
    select: {
      id: true,
      name: true,
      nutrientsId: true,
      userId: true,
    },
  });
}

export async function create(
  arg: { name: string; nutrientsId: string },
  context: CallContext,
) {
  const isNameUnique = await checkIfNameUnique({ name: arg.name }, context);
  if (!isNameUnique) {
    return Result.error(new FoodProduct.NameNotUniqueException({ name: arg.name }));
  }

  const result = await context.trx.product.create({
    data: {
      nutrientsId: arg.nutrientsId,
      userId: context.user.id,
      name: arg.name,
    },
    select: {
      id: true,
    },
  });

  return Result.success(result);
}

export async function update(arg: { id: string; name: string }, context: CallContext) {
  // Check if name is unique
  const name = arg.name;
  if (!(await checkIfNameUnique({ name }, context))) {
    return Result.error(new FoodProduct.NameNotUniqueException({ name }));
  }

  // Update product
  await context.trx.product.update({
    where: {
      id: arg.id,
      userId: context.user.id,
    },
    data: {
      name: arg.name,
    },
  });

  return Result.success(null);
}

export async function deleteMany(arg: ListFilter, context: CallContext) {
  const { count } = await context.trx.product.deleteMany({
    where: listFilter(arg),
  });

  return { count };
}
