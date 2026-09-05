import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', '.astro/**', 'public/files/**'],
  },

  // Registers the @typescript-eslint plugin/rules (also used for .astro frontmatter, see below)
  ...tseslint.configs.recommended,

  // Astro components
  ...eslintPluginAstro.configs.recommended,

  // React components (.jsx/.tsx), e.g. Astro islands
  {
    files: ['**/*.{jsx,tsx}'],
    ...eslintPluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // React 17+ automatic JSX runtime: no need for `import React` in scope
    files: ['**/*.{jsx,tsx}'],
    ...eslintPluginReact.configs.flat['jsx-runtime'],
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...eslintPluginReactHooks.configs['recommended-latest'],
  },

  // Accessibility rules — applies to React components and Astro templates alike
  {
    files: ['**/*.{jsx,tsx,astro}'],
    ...eslintPluginJsxA11y.flatConfigs.recommended,
  },

  {
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': ['error'],
    },
  },

  // Must stay last: disables ESLint formatting rules that would conflict with Prettier
  eslintConfigPrettier,
]);
