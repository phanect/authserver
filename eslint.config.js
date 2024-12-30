import { core } from "@phanect/lint";
import { join } from "node:path";
import ts from "typescript-eslint"; // eslint-disable-line import/no-unresolved

/** @type { import("eslint").Linter.Config[] } */
// @ts-expect-error
export default [
  {
    ignores: [
      "**/dist/**",

      // tmp
      join(import.meta.dirname, "workspaces/backend_/**"),
    ],
  },

  ...core,

  {
    // Do not add `files: [ "*" ],` here.

    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ts.configs.base,
  {
    files: [ "**/*.ts" ],
    rules: {
      // TODO merge to @phanect/lint
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [ "error", { ignoreRestSiblings: true }],
      "@typescript-eslint/no-use-before-define": "off"
    },
  },
];
