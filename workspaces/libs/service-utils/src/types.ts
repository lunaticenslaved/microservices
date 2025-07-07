export type AppConfig = {
  service: string;
  env: AppEnv;
  jwtGatewaySecret: string;
};

export enum AppEnv {
  Dev = 'dev',
  Prod = 'prod',
  Test = 'test',
}
