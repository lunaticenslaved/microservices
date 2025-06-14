import { Gateway } from '@libs/gateway';
import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: typeof prismaExtended;
}

const _prisma = new PrismaClient();
const prismaExtended = _prisma.$extends({
  client: {
    $noThrowTransaction<T>(
      callback: (client: Prisma.TransactionClient) => Promise<T>,
    ): Promise<T> {
      return _prisma.$transaction(async trx => {
        const innerResult = await callback(trx);

        if (innerResult instanceof Gateway.Exception) {
          await trx.$executeRaw`ROLLBACK`;
        }

        return innerResult;
      });
    },
  },
});

globalThis.prisma = prismaExtended;

export { prismaExtended as prisma };
export type PrismaTransaction = Prisma.TransactionClient;
