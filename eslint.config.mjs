// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.url,
      },
    },
  },
  {
    ignores: [
      'dist/**/*.ts',
      'dist/**',
      "**/*.mjs",
      "eslint.config.mjs",
      "**/*.js"
    ],
  },
);