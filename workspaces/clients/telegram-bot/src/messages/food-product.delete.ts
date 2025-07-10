import { MessageParser } from './MessageParser';
import { gateway } from '../gateway';

const pattern = /Удалить продукт (?<name>.+?)/;

export default new MessageParser({
  isMatch: text => pattern.test(text),
  handle: async text => {
    const productName = text.match(pattern)?.groups?.name;

    if (productName) {
      const findManyResponse = await gateway.command({
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

      if (!findManyResponse.success) {
        return {
          success: false,
          message: findManyResponse.message,
        };
      }

      if (findManyResponse.data.items.length === 0) {
        return {
          success: false,
          message: 'No products found',
        };
      } else if (findManyResponse.data.items.length > 1) {
        return {
          success: false,
          message: 'More than 1 product found',
        };
      }

      const [product] = findManyResponse.data.items;

      const deleteResponse = await gateway.command({
        command: 'food/product/delete',
        data: {
          id: product.id,
        },
      });

      if (!deleteResponse.success) {
        return {
          success: false,
          message: deleteResponse.message,
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
