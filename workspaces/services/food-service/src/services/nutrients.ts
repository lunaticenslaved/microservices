import { z } from 'zod/v4';
import { PrismaTransaction } from '../prisma';
import { parseSchema, PrismaUtils, SchemaUtils } from '#/utils';

export const CreateSchema = z.object({
  calories: z.coerce
    .number()
    .gte(0)
    .optional()
    .transform(val => Math.min(val ?? 0, 0)),
  proteins: z.coerce
    .number()
    .gte(0)
    .optional()
    .transform(val => Math.min(val ?? 0, 0)),
  fats: z.coerce
    .number()
    .gte(0)
    .optional()
    .transform(val => Math.min(val ?? 0, 0)),
  carbs: z.coerce
    .number()
    .gte(0)
    .optional()
    .transform(val => Math.min(val ?? 0, 0)),
  fibers: z.coerce
    .number()
    .gte(0)
    .optional()
    .transform(val => Math.min(val ?? 0, 0)),
});

export function create(
  data: z.infer<typeof CreateSchema>,
  context: {
    trx: PrismaTransaction;
  },
) {
  const parsed = parseSchema(data, CreateSchema);

  context.trx.food_Nutrients.create({
    data: parsed,
  });
}

// -------------------------------------------------------------------------------------------

export const UpdateSchema = z.object({
  id: z.uuid(),
  calories: SchemaUtils.numberUpdate(z.number().gte(0)).optional(),
  proteins: SchemaUtils.numberUpdate(z.number().gte(0)).optional(),
  fats: SchemaUtils.numberUpdate(z.number().gte(0)).optional(),
  carbs: SchemaUtils.numberUpdate(z.number().gte(0)).optional(),
  fibers: SchemaUtils.numberUpdate(z.number().gte(0)).optional(),
});

export type UpdateRequest = z.infer<typeof UpdateSchema>;

export async function update(
  data: UpdateRequest,
  context: {
    trx: PrismaTransaction;
  },
) {
  await context.trx.food_Nutrients.update({
    where: {
      id: data.id,
    },
    data: {
      calories: data.calories ? PrismaUtils.numberUpdate(data.calories) : undefined,
      proteins: data.proteins ? PrismaUtils.numberUpdate(data.proteins) : undefined,
      fats: data.fats ? PrismaUtils.numberUpdate(data.fats) : undefined,
      carbs: data.carbs ? PrismaUtils.numberUpdate(data.carbs) : undefined,
      fibers: data.fibers ? PrismaUtils.numberUpdate(data.fibers) : undefined,
    },
  });
}
