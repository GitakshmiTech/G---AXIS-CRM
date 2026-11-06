
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // Files and folders to ignore
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "dist/**",
      "build/**",
      "logs/**",
    ],
  },

  // Recommended ESLint rules
  js.configs.recommended,

  // Project JavaScript settings
  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",

      globals: {
        ...globals.node,
      },
    },

    rules: {
      // Catch unused variables
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Avoid accidental debugging statements
      "no-debugger": "error",

      // Allow console for server-side logging
      "no-console": "off",

      // Enforce clean code
      "no-duplicate-imports": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error",
    },
  },
];
