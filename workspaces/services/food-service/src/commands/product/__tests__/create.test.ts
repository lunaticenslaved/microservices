import createAction from '../create';

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
