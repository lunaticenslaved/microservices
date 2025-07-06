import { Service } from '@libs/gateway';

export const Endpoints: Record<Service, string> = {
  [Service.Food]: process.env.ENDPOINT__FOOD_SERVICE || '',
  [Service.Tag]: process.env.ENDPOINT__TAG_SERVICE || '',
};
