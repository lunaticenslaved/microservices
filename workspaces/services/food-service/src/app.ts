import { DB } from '#/db';
import { Service } from '@libs/service';

export type AppConfig = {
  service: 'food';
};

export interface AppCommandContext {
  db: DB;
  userId: string;
  app: {
    config: AppConfig;
  };
}

export type App = typeof App;

export const App = new Service<AppConfig, AppCommandContext>({
  service: 'food',
});
