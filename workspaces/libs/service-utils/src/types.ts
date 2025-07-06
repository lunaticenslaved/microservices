export type ServiceConfig = {
  service: string;
  env: AppEnv;
};

export enum AppEnv {
  Dev = 'dev',
  Prod = 'prod',
  Test = 'test',
}
