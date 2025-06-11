import { nonReachable } from './common';
import { NumberUpdate } from './schema';

export const PrismaUtils = {
  numberUpdate: (value: NumberUpdate) => {
    if (value.type === 'SET') {
      return {
        set: value.value,
      };
    } else if (value.type === 'INCREMENT') {
      return {
        increment: value.value,
      };
    } else if (value.type === 'DECREMENT') {
      return {
        decrement: value.value,
      };
    } else if (value.type === 'MULTIPLY') {
      return {
        multiply: value.value,
      };
    } else if (value.type === 'DIVIDE') {
      return {
        divide: value.value,
      };
    } else {
      nonReachable(value.type);
    }
  },
};
