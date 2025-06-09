import type { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

export default {
  verbose: true,
  projects: [
    {
      ...createDefaultPreset(),
      preset: 'ts-jest',
      testEnvironment: 'node',
      moduleNameMapper: {
        '^#/(.*)$': '<rootDir>/workspaces/services/food-service/src/$1',
      },
      testMatch: [
        '<rootDir>/workspaces/services/food-service/src/**/?(*.)+(spec|test).ts',
        '<rootDir>/workspaces/services/food-service/src/**__test__/?(*.)+(spec|test).ts',
      ],
      resolver: undefined,
      clearMocks: false,
      collectCoverage: true,
      coverageDirectory: 'coverage',
    } satisfies Config,
  ],
};
