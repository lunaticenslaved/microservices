import {
  createEntityFindManyValidator,
  EntityFindManyInput as EntityFindManyInputBase,
  EntityWhereInput as EntityWhereInputBase,
} from './config.find-many';
import { EntityFields } from './fields';

export class EntityConfig<T extends EntityFields> {
  private fields: T;

  constructor(fields: T) {
    this.fields = fields;
  }

  getFindManyValidator() {
    return createEntityFindManyValidator(this.fields);
  }
}

export type EntityFindManyInput<T> =
  T extends EntityConfig<infer U> ? EntityFindManyInputBase<U> : never;

export type EntityWhereInput<T> =
  T extends EntityConfig<infer U> ? EntityWhereInputBase<U> : never;
