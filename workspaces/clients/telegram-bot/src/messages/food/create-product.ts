import { MessageParser } from '../MessageParser';
import { gateway } from '../../gateway';

const pattern =
  /Добавить (?<name>.+?)\. КБЖУКл (?<calories>\d+\.?\d*) (?<proteins>\d+\.?\d*) (?<fats>\d+\.?\d*) (?<carbs>\d+\.?\d*) (?<fibers>\d+\.?\d*)/;

export default new MessageParser({
  isMatch: text => pattern.test(text),
  handle: async text => {
    const groups = text.match(pattern)?.groups;

    if (groups) {
      const response = await gateway.command({
        command: 'food/product/find-many',
        data: {
          where: {
            name: { in: [groups.name], mode: 'case-insensitive' },
          },
        },
      });

      if (!response.success) {
        return {
          success: false,
          message: response.message,
        };
      }

      if (response.data.items.length > 1) {
        return {
          success: false,
          message: 'Product with the name already exists',
        };
      }

      const result = await gateway.command({
        command: 'food/product/create',
        data: {
          name: groups.name,
          nutrients: {
            calories: parseFloat(groups.calories),
            proteins: parseFloat(groups.proteins),
            fats: parseFloat(groups.fats),
            carbs: parseFloat(groups.carbs),
            fibers: parseFloat(groups.fibers),
          },
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
