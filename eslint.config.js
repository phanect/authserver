import { core } from "@phanect/lint";

/** @type { import("eslint").Linter.Config[] } */
export default [
  {
    ignores: [
      "**/dist/**",
      "**/vendor/**",

      // tmporarily ignore
      "./workspaces/icedgate/src/libs/adapter-mysql.ts",
      "./workspaces/icedgate/src/libs/adapter-postgresql.ts",
      "./workspaces/icedgate/tests/adapter-*.ts",
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
];
