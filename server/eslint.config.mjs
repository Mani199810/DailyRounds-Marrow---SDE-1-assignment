import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: { 
      globals: globals.browser 
    },
    rules: {
      "react/prop-types": "off",
      "no-unused-vars": "warn",
      "prettier/prettier": ["error", { "endOfLine": "auto" }],
      "react/display-name": "off",
      "comma-dangle": ["error", "never"] // Corrected from "trailingComma"
    }
  },
  pluginJs.configs.recommended
];
