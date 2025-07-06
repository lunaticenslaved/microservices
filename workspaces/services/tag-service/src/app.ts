import { AppEnv, Application, ServiceConfig } from '@libs/service-utils';

export type AppConfig = ServiceConfig;

export type CommandContext = object;

// TODO add contract

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const App = new Application<AppConfig, CommandContext, any>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contract: {} as any,
  config: {
    service: 'tag',
    env: process.env.APP_ENV as AppEnv, // TODO Check in app
  },
});
