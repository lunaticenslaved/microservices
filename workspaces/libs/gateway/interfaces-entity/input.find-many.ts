import z from 'zod/v4';

import { nonReachable } from '@libs/common';

import {
  EntityFields,
  EntityNumberField,
  EntityRelationManyField,
  EntityRelationOneField,
  EntityStringField,
  EntityUUIDField,
  EntityDateTimeField,
} from './EntityConfig';

type EntityWhereInput<T extends EntityFields> = Partial<
  {
    [K in keyof T]: T[K] extends EntityStringField
      ? StringFilter
      : T[K] extends EntityUUIDField
        ? UUIDFilter
        : T[K] extends EntityNumberField
          ? NumberFilter
          : T[K] extends EntityDateTimeField
            ? DateTimeFilter
            : T[K] extends EntityRelationOneField
              ? RelationOneFilter<T[K]['entity']>
              : T[K] extends EntityRelationManyField
                ? RelationManyFilter<T[K]['entity']>
                : never;
  } & {
    AND: EntityWhereInput<T> | EntityWhereInput<T>[];
    OR: EntityWhereInput<T>[];
    NOT: EntityWhereInput<T> | EntityWhereInput<T>;
  }
>;

export type EntityFindManyInput<T extends EntityFields> = {
  where?: EntityWhereInput<T>;
};

type EntityFindManyWhereValidator<T extends EntityFields> = z.ZodObject<{
  [K in keyof T]: z.ZodType<EntityWhereInput<T>[K]>;
}>;

export function createEntityFindManyValidator<T extends EntityFields>(entityFields: T) {
  const whereShape: Record<string, unknown> = {};

  for (const field in entityFields) {
    const fieldConfig = entityFields[field];

    if (fieldConfig.type === 'string') {
      whereShape[field] = StringFilterValidator.optional();
    } else if (fieldConfig.type === 'number') {
      whereShape[field] = NumberFilterValidator.optional();
    } else if (fieldConfig.type === 'uuid') {
      whereShape[field] = UUIDFilterValidator.optional();
    } else if (fieldConfig.type === 'datetime') {
      whereShape[field] = DateTimeFilterValidator.optional();
    } else if (fieldConfig.type === 'relation') {
      if (fieldConfig.amount === 'one') {
        whereShape[field] = z
          .object({
            is: createEntityFindManyValidator(fieldConfig.entity),
            isNot: createEntityFindManyValidator(fieldConfig.entity),
          })
          .partial();
      } else if (fieldConfig.amount === 'many') {
        whereShape[field] = z
          .object({
            some: createEntityFindManyValidator(fieldConfig.entity),
            every: createEntityFindManyValidator(fieldConfig.entity),
          })
          .partial();
      }
    } else {
      nonReachable(fieldConfig);
    }
  }

  const where = z.lazy(() =>
    z.object(whereShape as EntityFindManyWhereValidator<T>['shape']).partial(),
  );

  whereShape['AND'] = z.union([where, z.array(where)]);
  whereShape['NOT'] = z.union([where, z.array(where)]);
  whereShape['OR'] = z.array(where);

  return z.object({ where }).partial();
}

type RelationOneFilter<T extends EntityFields> = {
  is?: EntityWhereInput<T>;
  isNot?: EntityWhereInput<T>;
};

type RelationManyFilter<T extends EntityFields> = {
  some?: EntityWhereInput<T>;
  every?: EntityWhereInput<T>;
};

type StringFilter =
  | string
  | {
      equals?: string;
      in?: string[];
      notIn?: string[];
      lt?: string;
      lte?: string;
      gt?: string;
      gte?: string;
      contains?: string;
      startsWith?: string;
      endsWith?: string;
      not?: StringFilter | string;
      mode?: 'default' | 'insensitive';
    };
const StringFilterValidator: z.ZodType<StringFilter> = z.union([
  z.string(),
  z
    .object({
      equals: z.string(),
      in: z.array(z.string()),
      notIn: z.array(z.string()),
      lt: z.string(),
      lte: z.string(),
      gt: z.string(),
      gte: z.string(),
      contains: z.string(),
      startsWith: z.string(),
      endsWith: z.string(),
      mode: z.union([z.literal('default'), z.literal('insensitive')]),
      not: z.lazy(() => StringFilterValidator),
    })
    .partial(),
]);

type UUIDFilter =
  | string
  | {
      equals?: string;
      in?: string[];
      notIn?: string[];
      lt?: string;
      lte?: string;
      gt?: string;
      gte?: string;
      not?: UUIDFilter | string;
      mode?: 'default' | 'insensitive';
    };
const UUIDFilterValidator: z.ZodType<UUIDFilter> = z.union([
  z.string(),
  z
    .object({
      equals: z.uuid(),
      in: z.array(z.uuid()),
      notIn: z.array(z.uuid()),
      lt: z.uuid(),
      lte: z.uuid(),
      gt: z.uuid(),
      gte: z.uuid(),
      mode: z.union([z.literal('default'), z.literal('insensitive')]),
      not: z.lazy(() => UUIDFilterValidator),
    })
    .partial(),
]);

type NumberFilter =
  | number
  | {
      equals?: number;
      in?: number[];
      notIn?: number[];
      lt?: number;
      lte?: number;
      gt?: number;
      gte?: number;
      not?: NumberFilter | number;
    };
const NumberFilterValidator: z.ZodType<NumberFilter> = z.union([
  z.number(),
  z
    .object({
      equals: z.number(),
      in: z.array(z.number()),
      notIn: z.array(z.number()),
      lt: z.number(),
      lte: z.number(),
      gt: z.number(),
      gte: z.number(),
      mode: z.union([z.literal('default'), z.literal('insensitive')]),
      not: z.lazy(() => NumberFilterValidator),
    })
    .partial(),
]);

type DateTimeFilter =
  | Date
  | string
  | {
      equals?: Date | string;
      in?: Date[] | string[];
      notIn?: Date[] | string[];
      lt?: Date | string;
      lte?: Date | string;
      gt?: Date | string;
      gte?: Date | string;
      not?: DateTimeFilter;
    };
const DateTimeFilterValidator: z.ZodType<DateTimeFilter> = z.union([
  z.date(),
  z.iso.datetime(),
  z
    .object({
      equals: z.union([z.date(), z.iso.datetime()]),
      in: z.union([z.array(z.date()), z.array(z.iso.datetime())]),
      notIn: z.union([z.array(z.date()), z.array(z.iso.datetime())]),
      lt: z.union([z.date(), z.iso.datetime()]),
      lte: z.union([z.date(), z.iso.datetime()]),
      gt: z.union([z.date(), z.iso.datetime()]),
      gte: z.union([z.date(), z.iso.datetime()]),
      not: z.lazy(() => DateTimeFilterValidator),
    })
    .partial(),
]);
