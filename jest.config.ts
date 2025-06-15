import type { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest';

export default {
  verbose: true,
  projects: [
    {
      ...createDefaultPreset(),
      rootDir: './workspaces/services/food-service',
      preset: 'ts-jest',
      testEnvironment: 'node',
      moduleNameMapper: {
        '^#/(.*)$': '<rootDir>/src/$1',
      },
      testMatch: [
        '<rootDir>/src/**/?(*.)+(spec|test).ts',
        '<rootDir>/src/**__tests__/?(*.)+(spec|test).ts',
      ],
      resolver: undefined,
      clearMocks: false,
      // collectCoverage: true,
      coverageDirectory: 'coverage',
      setupFilesAfterEnv: ['./jest.setup.ts'],
    } satisfies Config,
  ],
};
