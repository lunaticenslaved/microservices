import * as FoodService from './food';
import * as TagService from './tag';

export { FoodService, TagService };

export enum Service {
  Food = 'food',
  Tag = 'tag',
}

export const ServiceContracts = {
  [Service.Food]: FoodService.Contract,
  [Service.Tag]: TagService.Contract,
};
