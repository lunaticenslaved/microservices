export * from './food';
export * from './tag';

import { type FoodCommandConfig, FoodContract } from './food';
import { type TagCommandConfig, TagContract } from './tag';

export enum Service {
  Food = 'food',
  Tag = 'tag',
}

export const ServiceContracts = {
  [Service.Food]: FoodContract,
  [Service.Tag]: TagContract,
};

export type ServiceCommandConfig = FoodCommandConfig | TagCommandConfig;

export type ExtractCommandContract<T extends ServiceCommandConfig['command']> = Extract<
  ServiceCommandConfig,
  { command: T }
>;
