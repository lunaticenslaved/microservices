import { Gateway } from '@libs/gateway';

import createAction from '../create';
import { createTestCommandContext } from '#/utils-test';
import { Database } from '#/db';

type CreateCommand = Gateway.Food.Product.CreateCommand;

describe('validator is valid', () => {
  test('name is trimmed', () => {
    const request: CreateCommand['request']['data'] = {
      name: { value: ' name ' },
      nutrients: {
        calories: { value: 0 },
        proteins: { value: 0 },
        fats: { value: 0 },
        carbs: { value: 0 },
        fibers: { value: 0 },
      },
    };

    const parsed = createAction.validator.safeParse(request);
    expect(parsed.success).toBeTruthy();

    if (!parsed.success) return;
    expect(parsed.data.name.value).toBe('name');
  });
});

describe('can create product', () => {
  let productId: string;
  let result: CreateCommand['response'] | CreateCommand['exceptions'];

  beforeAll(async () => {
    result = await createAction.handler(
      {
        command: 'food/product/create',
        data: {
          name: { value: 'product-1 ' },
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
    expect(result.status).toBe(201);
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
