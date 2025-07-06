import { randomUUID } from 'crypto';
import { ItemType } from '../db/generated';
import { Database } from './db-singleton';
import { Exception } from '@libs/gateway';

const data = {
  userId: randomUUID(),
  itemType: ItemType.FoodProduct,
  itemId: randomUUID(),
  key: 'key',
};

test('test transaction rollback', async () => {
  const result = await Database.prisma.$noThrowTransaction(async trx => {
    await trx.uniqueKey.create({
      data,
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

  const product = await Database.prisma.uniqueKey.findFirst({
    where: data,
  });

  expect(!!product).toBeFalsy();
});
