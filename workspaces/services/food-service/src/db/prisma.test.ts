import { randomUUID } from 'crypto';
import { Gateway } from '@libs/gateway';
import { Database } from './db-singleton';

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
      return Gateway.createException({
        type: 'test',
        status: 400,
        message: 'Message',
        details: null,
      });
    }

    return 1;
  });

  expect(result).toBeInstanceOf(Gateway.Exception);

  const product = await Database.prisma.product.findFirst({
    where: {
      name: 'product-1',
    },
  });

  expect(!!product).toBeFalsy();
});
