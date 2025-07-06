import { AppEnv, Application, ServiceConfig } from '@libs/service-utils';

export type AppConfig = ServiceConfig;

export type CommandContext = object;

export const App = new Application<AppConfig, CommandContext>({
  config: {
    service: 'food',
    env: process.env.APP_ENV as AppEnv, // TODO Check in app
  },
});
