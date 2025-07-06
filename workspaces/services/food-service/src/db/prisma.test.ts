import { randomUUID } from 'crypto';
import { Database } from './db-singleton';
import { Exception } from '@libs/gateway';

test('test transaction rollback', async () => {
  const result = await Database.prisma.$noThrowTransaction(async trx => {
    await trx.product.create({
      data: {
        userId: randomUUID(),
        name: 'product-1',
        nutrients: {
          create: {},
        },
      },
    });

    if (![].length) {
      return new Exception({
        type: 'test',
        status: 400,
        message: 'Message',
        details: null,
      });
    }

    return 1;
  });

  expect(result).toBeInstanceOf(Exception);

  const product = await Database.prisma.product.findFirst({
    where: {
      name: 'product-1',
    },
  });

  expect(!!product).toBeFalsy();
});
