import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript-eslint flat/recommended
  ...tsPlugin.configs["flat/recommended"],

  // Next.js core-web-vitals flat config
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.flatConfig.coreWebVitals.rules,
    },
  },

  // Project-specific rules for all TS/TSX files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-eval": "error",
      "no-implied-eval": "error",
    },
  },

  // Override for test files - relax no-explicit-any
  {
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "out/**",
      "coverage/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.cjs",
      "next-env.d.ts",
    ],
  },
];

export default config;
