// @ts-check
import stylistic from '@stylistic/eslint-plugin'

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['warn', 'always']
    },
    ignores: ['**/generated'],
  }
);