import { Gateway } from '@libs/gateway';

export const Endpoints: Record<Gateway.Services, string> = {
  [Gateway.Services.Food]: process.env.ENDPOINT__FOOD_SERVICE || '',
  [Gateway.Services.Tag]: process.env.ENDPOINT__TAG_SERVICE || '',
};
