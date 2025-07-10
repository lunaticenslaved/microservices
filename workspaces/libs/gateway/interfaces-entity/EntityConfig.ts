import {
  createEntityFindManyValidator,
  EntityFindManyInput as EntityFindManyInputBase,
} from './input.find-many';

export class EntityConfig<T extends Record<string, EntityField>> {
  private fields: T;

  constructor(fields: T) {
    this.fields = fields;
  }

  getFindManyValidator() {
    return createEntityFindManyValidator(this.fields);
  }
}

// Request inputs ----------------------------------------------------------
export type EntityFindManyInput<T> =
  T extends EntityConfig<infer U> ? EntityFindManyInputBase<U> : never;

// Fields ------------------------------------------------------------------
export type EntityRelationOneField = {
  type: 'relation';
  amount: 'one';
  entity: Record<string, EntityField>;
};

export type EntityRelationManyField = {
  type: 'relation';
  amount: 'many';
  entity: Record<string, EntityField>;
};

export type EntityStringField = {
  type: 'string';
};

export type EntityUUIDField = {
  type: 'uuid';
};

export type EntityNumberField = {
  type: 'number';
};

export type EntityDateTimeField = {
  type: 'datetime';
};

export type EntityField =
  | EntityStringField
  | EntityUUIDField
  | EntityNumberField
  | EntityDateTimeField
  | EntityRelationOneField
  | EntityRelationManyField;

export type EntityFields = Record<string, EntityField>;
