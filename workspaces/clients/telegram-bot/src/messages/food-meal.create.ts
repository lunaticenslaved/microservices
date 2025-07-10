import dayjs from 'dayjs';
import { gateway } from '../gateway';
import { MessageParser } from './MessageParser';

const pattern = /Добавить еду (?<date>.+?) (?<productName>.+?) (?<grams>\d+) г/;

export default new MessageParser({
  isMatch: text => pattern.test(text),
  handle: async text => {
    const groups = text.match(pattern)?.groups;

    if (groups) {
      const date = groups.date;
      const productName = groups.productName;
      const grams = parseFloat(groups.grams);

      let dateObj = dayjs();
      if (date === 'сегодня') {
        //
      } else if (date === 'вчера') {
        dateObj = dayjs().subtract(1, 'day');
      } else {
        dateObj = dayjs('DD.MM.YYYY');
      }

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
          datetime: dateObj.toISOString(),
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
