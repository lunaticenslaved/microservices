import { EntityConfig, EntityFindManyInput } from './../../../interfaces-entity';

export const MealConfig = new EntityConfig({
  id: { type: 'uuid' },
  datetime: { type: 'datetime' },
  grams: { type: 'number' },

  productId: { type: 'uuid' },
  product: {
    type: 'relation',
    amount: 'one',
    entity: {
      id: { type: 'uuid' },
      name: { type: 'string' },
    },
  },
});

export type MealFindManyInput = EntityFindManyInput<typeof MealConfig>;
