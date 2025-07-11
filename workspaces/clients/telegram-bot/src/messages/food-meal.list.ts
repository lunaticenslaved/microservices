import { dayjs } from '../libs/dayjs';

import { gateway } from '../gateway';
import { MessageParser } from './MessageParser';
import { FoodDomain } from '@libs/domain';
import { FoodProduct } from '@libs/gateway';

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

      const [{ mealsForDate }] = FoodDomain.groupMeals(meals);

      let str = `${dateObj.format('L')} - ${formatNutrients(
        sumNutrients(mealsForDate.flat(), productsResult.data.items),
      )}`;

      return {
        success: true,
        message:
          str +
          mealsForDate
            .map(meals => {
              str = `\n\n${dayjs(meals[0].datetime).format('LT')} - ${formatNutrients(sumNutrients(meals, productsResult.data.items))}`;

              str += '\n---';

              for (const meal of meals) {
                const product = productsResult.data.items.find(
                  p => p.id === meal.productId,
                );

                str += `\n${meal.id.slice(0, 6)} - ${product?.name || 'Unknown product'} - ${meal.grams} г - ${formatNutrients(sumNutrients([meal], productsResult.data.items))}`;
              }

              return str;
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

function sumNutrients(
  meals: FoodDomain.Meal[],
  products: Pick<FoodProduct.DTO, 'id' | 'nutrients'>[],
) {
  const nutrients = meals.map(meal => {
    const product = products.find(p => p.id === meal.productId);
    const nutrients = FoodDomain.multiplyNutrients({
      nutrients: FoodDomain.divideNutrients({
        nutrients: product?.nutrients || {},
        num: 100,
      }),
      num: meal.grams,
    });

    return nutrients;
  });

  return FoodDomain.sumNutrients(nutrients);
}

function round(num: number) {
  return num.toFixed(0);
}

function formatNutrients(nutrients: Partial<FoodDomain.Nutrients>) {
  return `КБЖУКл: ${round(nutrients.calories ?? 0)} | ${round(nutrients.proteins ?? 0)} | ${round(nutrients.fats ?? 0)} | ${round(nutrients.carbs ?? 0)} | ${round(nutrients.fibers ?? 0)} `;
}
