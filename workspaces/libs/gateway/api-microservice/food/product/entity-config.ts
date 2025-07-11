import { EntityConfig, EntityFindManyInput } from './../../../interfaces-entity';

export const ProductEntityConfig = new EntityConfig({
  id: { type: 'uuid' },
  name: { type: 'string' },
});

export type ProductFindManyInput = EntityFindManyInput<typeof ProductEntityConfig>;
