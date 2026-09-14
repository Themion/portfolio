import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["node_modules/**", "dist/**", ".astro/**", "public/files/**"],
  },

  // Registers the @typescript-eslint plugin/rules (also used for .astro frontmatter, see below)
  ...tseslint.configs.recommended,

  // Astro components
  ...eslintPluginAstro.configs.recommended,

  // Accessibility rules for Astro templates
  {
    files: ["**/*.astro"],
    ...eslintPluginJsxA11y.flatConfigs.recommended,
  },

  {
    plugins: {
      "simple-import-sort": eslintPluginSimpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/consistent-type-imports": ["error"],
    },
  },

  // Must stay last: runs Prettier as an ESLint rule (`eslint --fix` now also applies
  // Prettier formatting, including tailwind class sorting) and disables ESLint
  // formatting rules that would conflict with it
  eslintPluginPrettierRecommended,

  // eslint-plugin-astro lints <script> blocks as virtual `*.astro/*.js(x)` files, but
  // eslint-plugin-prettier still formats those with the `astro` parser (inferred from the
  // `.astro` in the virtual path), which crashes on multi-statement scripts. Prettier still
  // formats these scripts correctly on its own (`prettier --write`, editor integration), so
  // just skip the redundant, broken ESLint-driven pass.
  // See https://github.com/withastro/prettier-plugin-astro/issues/407
  {
    files: ["**/*.astro/*.js", "**/*.astro/*.ts"],
    rules: {
      "prettier/prettier": "off",
    },
  },
]);
