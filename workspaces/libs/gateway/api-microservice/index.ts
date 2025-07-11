import * as FoodService from './food';
import * as TagService from './tag';

export enum Service {
  Food = 'food',
  Tag = 'tag',
}

export const ServiceContracts = {
  [Service.Food]: FoodService.Contract,
  [Service.Tag]: TagService.Contract,
};

export type ServiceCommandConfig = TagService.CommandConfigs | FoodService.CommandConfigs;

export type ExtractCommandContract<T extends ServiceCommandConfig['command']> = Extract<
  ServiceCommandConfig,
  { command: T }
>;

export { FoodService, TagService };
