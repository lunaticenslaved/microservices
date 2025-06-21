import z from 'zod/v4';
import {
  NumberCreate,
  NumberUpdate,
  StringCreate,
  StringUpdate,
} from '@libs/gateway/gateway/common';

// TODO move it somewhere

export const ServiceUtils = {
  numberCreate: {
    schema: (value: z.ZodNumber): z.ZodType<NumberCreate> => {
      return z.object({ value });
    },
    prisma: ({ value }: NumberCreate) => {
      return value;
    },
  },

  numberUpdate: {
    schema: (value: z.ZodNumber): z.ZodType<NumberUpdate> => {
      return z.object({ value });
    },
    prisma: (value: NumberUpdate) => {
      return {
        set: value.value,
      };
    },
  },

  stringUpdate: {
    schema: (value: z.ZodString): z.ZodType<StringUpdate> => {
      return z.object({ value });
    },
    prisma: (value: StringUpdate) => {
      return {
        set: value.value,
      };
    },
  },

  stringCreate: {
    schema: (value: z.ZodString): z.ZodType<StringCreate> => {
      return z.object({ value });
    },
    prisma: (value: StringCreate) => {
      return value.value;
    },
  },
};
