import { App } from '#/app';
import { Components } from '#/components';
import { Database } from '#/db';
import { SuccessResponse } from '@libs/gateway';
import z from 'zod/v4';

export default App.addCommand({
  command: 'food/product/find-many',
  validator: z.object({
    where: z
      .object({
        id: z.object({ in: z.array(z.string()) }),
        name: z
          .object({
            startsWith: z.string(),
            mode: z.enum(['case-sensitive', 'case-insensitive']),
            in: z.array(z.string()),
          })
          .partial(),
      })
      .partial()
      .optional(),
  }),
  handler: async ({ data: { where }, enrichments: { user } }) => {
    return Database.prisma.$noThrowTransaction(async trx => {
      const items = await Components.Product.findMany_DTO(
        {
          where,
        },
        {
          trx,
          user,
        },
      );

      return new SuccessResponse({
        status: 200,
        data: {
          items,
        },
      });
    });
  },
});
