import js from "@eslint/js";
import globals from "globals";
import vue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, ...vue.configs["flat/recommended"], prettier],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
