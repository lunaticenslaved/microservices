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
