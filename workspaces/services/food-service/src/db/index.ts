import { Gateway } from '@libs/gateway';
import { Prisma, PrismaClient } from './generated/client';

function createClient(arg: { databaseUrl: string }) {
  const _prisma = new PrismaClient({ datasourceUrl: arg.databaseUrl });

  return _prisma.$extends({
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
}

export namespace DB {
  export type Transaction = Prisma.TransactionClient;
}

export class DB {
  private static _Client = createClient({ databaseUrl: '' });

  get Client() {
    return DB._Client;
  }

  static async connect(...args: Parameters<typeof createClient>) {
    DB._Client = createClient(...args);

    await DB._Client.$connect();
  }
}
