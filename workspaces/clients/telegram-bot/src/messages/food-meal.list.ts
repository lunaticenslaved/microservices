import { dayjs } from '../libs/dayjs';

import { gateway } from '../gateway';
import { MessageParser } from './MessageParser';
import { FoodDomain } from '@libs/domain';

const pattern = /^Список еды (?<date>.+?)$/;

export default new MessageParser({
  isMatch: text => pattern.test(text),
  handle: async text => {
    const date = text.match(pattern)?.groups?.date;

    if (date) {
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

      const meals = response.data.items;

      if (meals.length === 0) {
        return {
          success: true,
          message: 'No meals found',
        };
      }

      const productsResult = await gateway.command({
        command: 'food/product/find-many',
        data: {
          where: {
            id: { in: meals.map(meal => meal.productId) },
          },
        },
      });

      if (!productsResult.success) {
        return {
          success: false,
          message: productsResult.message,
        };
      }

      return {
        success: true,
        message: meals
          .map(meal => {
            const product = productsResult.data.items.find(p => p.id === meal.productId);
            const nutrients = FoodDomain.multiplyNutrients({
              nutrients: product?.nutrients || {},
              grams: meal.grams / 100,
            });

            return `${meal.id.slice(0, 6)} - ${product?.name || 'Unknown product'} - ${meal.grams} г - Ккал: ${nutrients.calories}, Белки: ${nutrients.proteins} г, Жиры: ${nutrients.fats} г, Углеводы: ${nutrients.carbs} г, Клетчатка: ${nutrients.fibers} г`;
          })
          .join('\n'),
      };
    }

    return {
      success: false,
      message: 'Unknown date',
    };
  },
});
