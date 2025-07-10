import { MessageParser } from './MessageParser';
import { gateway } from '../gateway';

const pattern = /Список продуктов/;

export default new MessageParser({
  isMatch: text => pattern.test(text),
  handle: async () => {
    const response = await gateway.command({
      command: 'food/product/find-many',
      data: {},
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    return {
      success: true,
      message: response.data.items.map(product => product.name).join('\n'),
    };
  },
});
