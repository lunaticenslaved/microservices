import createAction, { CreateRequest } from '../create';

describe('validator is valid', () => {
  test('name is trimmed', () => {
    const data: CreateRequest['data'] = {
      name: ' name ',
      nutrients: {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
        fibers: 0,
      },
    };

    const parsed = createAction.validator.safeParse(data);

    expect(parsed.success).toBeTruthy();

    if (!parsed.success) return;

    expect(parsed.data.name).toBe('name');
  });
});
