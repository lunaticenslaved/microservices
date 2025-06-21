import { randomUUID } from 'crypto';
import { Gateway } from '@libs/gateway';
import { ItemType, Service } from '../db/generated';
import { Database } from './db-singleton';

const data = {
  userId: randomUUID(),
  service: Service.Food,
  itemType: ItemType.Product,
  itemId: randomUUID(),
  tag: 'tag',
};

test('test transaction rollback', async () => {
  const result = await Database.prisma.$noThrowTransaction(async trx => {
    await trx.tag.create({
      data,
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

  const product = await Database.prisma.tag.findFirst({
    where: data,
  });

  expect(!!product).toBeFalsy();
});
