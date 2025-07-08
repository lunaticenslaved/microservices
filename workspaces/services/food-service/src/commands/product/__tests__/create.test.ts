import createCommand from '../create';
import { createTestCommandContext } from '#/utils-test';
import { Database } from '#/db';
import { FoodProduct } from '@libs/gateway';
import { UnwrapPromiseFnResult } from '@libs/common';
import { randomUUID } from 'crypto';

type CreateCommand = FoodProduct.CreateCommand;

describe('validator is valid', () => {
  test('name is trimmed', () => {
    const request: CreateCommand['request']['data'] = {
      name: ' name ',
      nutrients: {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
        fibers: 0,
      },
    };

    const parsed = createCommand.validator.safeParse(request);
    expect(parsed.success).toBeTruthy();

    if (!parsed.success) return;
    expect(parsed.data.name).toBe('name');
  });

  test('check pass without nutrients', () => {
    const request: CreateCommand['request']['data'] = {
      name: 'name-1',
    };

    const parsed = createCommand.validator.safeParse(request);
    expect(parsed.success).toBeTruthy();
  });
});

describe('can create product', () => {
  let productId: string;
  let result: UnwrapPromiseFnResult<typeof createCommand.handler>;

  beforeAll(async () => {
    result = await createCommand.handler(
      {
        command: 'food/product/create',
        data: {
          name: 'product-1 ',
        },
        enrichments: {
          user: {
            id: randomUUID(),
          },
        },
      },
      createTestCommandContext(),
    );

    if (result.success) {
      productId = result.data.id;
    }
  });

  test('success result', () => {
    expect(result.success).toBe(true);
  });

  test('status is 201', () => {
    if (result.success) {
      expect(result.status).toBe(201);
    } else {
      throw new Error('Not valid');
    }
  });

  test('product created', async () => {
    const found = await Database.prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    expect(found).toBeDefined();
  });
});
