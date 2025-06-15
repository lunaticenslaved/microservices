import { randomUUID } from 'crypto';
import { DB } from '.';
import { Gateway } from '@libs/gateway';

const db = new DB();

test('test transaction rollback', async () => {
  const result = await db.Client.$noThrowTransaction(async trx => {
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

  const product = await db.Client.product.findFirst({
    where: {
      name: 'product-1',
    },
  });

  expect(!!product).toBeFalsy();
});
