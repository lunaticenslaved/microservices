import { randomUUID } from 'crypto';
import createAction from '../create';

import { prisma } from '#/prisma';
import { Gateway } from '@libs/gateway';

describe('validator is valid', () => {
  test('name is trimmed', () => {
    const parsed = createAction.validator.safeParse({
      name: ' name ',
      nutrients: {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
        fibers: 0,
      },
    });

    expect(parsed.success).toBeTruthy();

    if (!parsed.success) return;

    expect(parsed.data.name).toBe('name');
  });
});

test('test transaction rollback', async () => {
  const result = await prisma?.$noThrowTransaction(async trx => {
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

  const product = await prisma?.product.findFirst({
    where: {
      name: 'product-1',
    },
  });

  expect(!!product).toBeFalsy();
});
