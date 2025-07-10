import { dayjs } from '#/libs/dayjs';
import { gateway } from '../gateway';
import { MessageParser } from './MessageParser';

const pattern = /^Удалить еду (?<date>.+?) (?<key>.+?)$/;

export default new MessageParser({
  isMatch: text => pattern.test(text),
  handle: async text => {
    const groups = text.match(pattern)?.groups;

    if (groups) {
      const { date, key } = groups;

      let dateObj = dayjs();
      if (date === 'сегодня') {
        //
      } else if (date === 'вчера') {
        dateObj = dayjs().subtract(1, 'day');
      } else {
        dateObj = dayjs('DD.MM.YYYY');
      }

      const response = await gateway.command({
        command: 'food/meal/find-many',
        data: {
          where: {
            datetime: {
              gte: dateObj.startOf('day').toISOString(),
              lt: dateObj.endOf('day').toISOString(),
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

      const matchedMeals = response.data.items.filter(meal => meal.id.startsWith(key));

      if (matchedMeals.length === 0) {
        return {
          success: false,
          message: 'No items found',
        };
      } else if (matchedMeals.length > 1) {
        return {
          success: false,
          message: 'More than 1 item found',
        };
      }

      const [meal] = matchedMeals;

      const result = await gateway.command({
        command: 'food/meal/delete',
        data: {
          id: meal.id,
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
