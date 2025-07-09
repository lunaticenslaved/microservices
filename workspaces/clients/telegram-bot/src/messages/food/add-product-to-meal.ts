import { gateway } from '../../gateway';
import { MessageParser } from '../MessageParser';

const pattern = /Добавить (.+?), (\d+) г/;

export default new MessageParser({
  isMatch: text => pattern.test(text),
  handle: async text => {
    const match = text.match(pattern);

    if (match) {
      const productName = match[1]; // "Chocolate Cake"
      const grams = parseFloat(match[2]); // 500 (as a number)

      const response = await gateway.command({
        command: 'food/product/find-many',
        data: {
          where: {
            name: {
              in: [productName],
              mode: 'insensitive',
            },
          },
        },
      });

      if (!response.success) {
        return {
          success: false,
          message: response.message,
        };
      }

      if (response.data.items.length === 0) {
        return {
          success: false,
          message: 'No products found',
        };
      } else if (response.data.items.length > 1) {
        return {
          success: false,
          message: 'More than 1 product found',
        };
      }

      const [product] = response.data.items;

      const result = await gateway.command({
        command: 'food/meal/create',
        data: {
          productId: product.id,
          grams,
        },
      });

      if (!result.success) {
        return {
          success: false,
          message: result.message,
        };
      }

      return {
        success: true,
        message: 'Success',
      };
    } else {
      return {
        success: false,
        message: `Invalid format. Use: ${String(pattern)}`,
      };
    }
  },
});
