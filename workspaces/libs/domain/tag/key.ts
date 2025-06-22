import z from 'zod/v4';

export enum ItemType {
  FoodProduct = 'food/product',
}

export type Key = {
  id: string;
  userId: string;
  itemType: ItemType;
  itemId: string;
  key: string;
};

export const KeySchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  itemId: z.uuid(),
  itemType: z.enum(Object.values(ItemType)),
  key: z.string().max(255), // FIXME transform to slug
}) satisfies z.ZodType<Key>;
