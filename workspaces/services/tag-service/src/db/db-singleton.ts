import { Exception } from '@libs/gateway';
import { Prisma, PrismaClient as PrismaClientGen } from './generated/client';

export type PrismaClient = ReturnType<typeof createPrismaClient>;

function createPrismaClient(arg: { databaseUrl: string }) {
  const _prisma = new PrismaClientGen({
    datasourceUrl: arg.databaseUrl || process.env.DATABASE_URL || '',
  });

  return _prisma.$extends({
    client: {
      $noThrowTransaction<T>(
        callback: (client: Prisma.TransactionClient) => Promise<T>,
      ): Promise<T> {
        return _prisma.$transaction(async trx => {
          const innerResult = await callback(trx);

          if (innerResult instanceof Exception) {
            await trx.$executeRaw`ROLLBACK`;
          }

          return innerResult;
        });
      },
    },
  });
}

export class Database {
  static prisma = {} as PrismaClient;

  static async connect(...args: Parameters<typeof createPrismaClient>) {
    Database.prisma = createPrismaClient(...args);

    await Database.prisma.$connect();
  }
}
