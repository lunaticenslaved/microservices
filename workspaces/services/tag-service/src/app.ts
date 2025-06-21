import { AppEnv, Service, ServiceConfig } from '@libs/service';

export type AppConfig = ServiceConfig;

export type CommandContext = {
  user: {
    id: string;
  };
};

export const App = new Service<AppConfig, CommandContext>({
  config: {
    service: 'tag',
    env: process.env.APP_ENV as AppEnv, // TODO Check in app
  },
});
