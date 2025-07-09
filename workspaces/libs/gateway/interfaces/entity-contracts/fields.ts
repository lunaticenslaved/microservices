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

export type EntityField =
  | EntityStringField
  | EntityUUIDField
  | EntityNumberField
  | EntityRelationOneField
  | EntityRelationManyField;

export type EntityFields = Record<string, EntityField>;
