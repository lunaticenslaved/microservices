import z from 'zod/v4';
import validator from 'validator';

export enum ItemType {
  FoodProduct = 'food/product',
}

export type UniqueKey = {
  id: string;
  userId: string;
  itemType: ItemType;
  itemId: string;
  key: string;
};

export const UniqueKeySchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  itemId: z.uuid(),
  itemType: z.enum(Object.values(ItemType)),
  key: z
    .string()
    .refine(
      value => {
        return validator.isSlug(value);
      },
      {
        error: 'Key should be in slug format',
      },
    )
    .max(255), // FIXME transform to slug
}) satisfies z.ZodType<UniqueKey>;
