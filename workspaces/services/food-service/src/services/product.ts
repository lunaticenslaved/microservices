import { Models } from '#/models';
import { PrismaTransaction } from '../prisma';

export async function checkIfNameUnique(
  arg: { name: string },
  trx: PrismaTransaction,
): Promise<{ unique: boolean }> {
  const found = await trx.food_Product.findFirst({
    where: {
      name: arg.name,
    },
  });

  return {
    unique: !found,
  };
}

export async function get(
  arg: {
    id: string;
  },
  context: {
    trx: PrismaTransaction;
  },
): Promise<Models.Product> {
  return await context.trx.food_Product.findFirstOrThrow({
    where: {
      id: arg.id,
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
}
