// @ts-check
import stylistic from '@stylistic/eslint-plugin';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      "src/generated/**",
      "dist/**"
    ],
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['warn', 'always'],
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
);