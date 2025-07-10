import { EntityConfig, EntityFindManyInput } from './../../../interfaces-entity';

export const ProductConfig = new EntityConfig({
  id: { type: 'uuid' },
  name: { type: 'string' },
});

export type ProductFindManyInput = EntityFindManyInput<typeof ProductConfig>;
