import { AppEnv, Application, ServiceConfig } from '@libs/service-utils';
import { FoodService } from '@libs/gateway';

export type AppConfig = ServiceConfig;

export type CommandContext = object;

export const App = new Application<
  AppConfig,
  CommandContext,
  typeof FoodService.Contract
>({
  contract: FoodService.Contract,
  config: {
    service: 'food',
    env: process.env.APP_ENV as AppEnv, // TODO Check in app
  },
});
