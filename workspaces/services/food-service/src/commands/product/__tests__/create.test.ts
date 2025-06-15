import { Gateway } from '@libs/gateway';
import { randomUUID } from 'crypto';

import createAction from '../create';
import { DB } from '#/db';

const db = new DB();

describe('validator is valid', () => {
  test('name is trimmed', () => {
    const request: Gateway.Food.Product.CreateRequest['data'] = {
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
  let result: Gateway.Food.Product.CreateResponse | Gateway.Food.Product.CreateExceptions;

  beforeAll(async () => {
    result = await createAction.handler(
      {
        service: 'food',
        command: 'product/create',
        data: {
          name: { value: 'product-1 ' },
        },
      },
      {
        db,
        userId: randomUUID(),
      },
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
    const found = await db.Client.product.findFirst({
      where: {
        id: productId,
      },
    });

    expect(found).toBeDefined();
  });

  test('name is trimmed', async () => {
    const found = await db.Client.product.findFirst({
      where: {
        id: productId,
      },
    });

    expect(found?.name).toBe('product-1');
  });
});
