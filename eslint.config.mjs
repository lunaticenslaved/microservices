import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier/recommended';
import jest from 'eslint-plugin-jest';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    ignores: ['node_modules'],
  },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.node } },
  tseslint.config({
    extends: tseslint.configs.recommended,
    rules: {
      '@typescript-eslint/no-namespace': 0,
    },
  }),
  {
    files: ['**/*.test.ts', '**/__tests__/*.ts'],
    plugins: { jest },
    ignores: ['node_modules'],
  },
  prettier,
]);
