import { AppEnv, Application } from '@libs/service-utils';

export type AppConfig = object;
export type CommandContext = object;

export const App = new Application<AppConfig, CommandContext>({
  config: {
    service: 'tag',
    env: process.env.APP_ENV as AppEnv, // TODO Check in app
    jwtGatewaySecret: process.env.JWT_GATEWAY_SECRET || '',
  },
  localConfig: {},
});
