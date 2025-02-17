module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 8 },
  ignorePatterns: [
    "node_modules/*",
    ".next/*",
    ".out/*",
    "!.prettierrc.js",
    "public/*",
  ],
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      settings: { react: { version: "detect" } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
      ],
      rules: {
        "prettier/prettier": ["error", {}, { usePrettierrc: true }],

        "react/prop-types": "off",

        "react/react-in-jsx-scope": "off",

        "jsx-a11y/anchor-is-valid": "off",

        "@typescript-eslint/no-unused-vars": ["error"],

        "@typescript-eslint/explicit-function-return-type": "off",

        "@typescript-eslint/explicit-module-boundary-types": "off",

        "no-useless-catch": "off",

        "react/display-name": "off",

        "jsx-a11y/no-autofocus": "off",

        "@typescript-eslint/no-explicit-any": "off",

        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["**/*.js", "**/*.jsx"],
      extends: ["next", "plugin:prettier/recommended"],
      rules: {
        "prettier/prettier": ["error", {}, { usePrettierrc: true }],
      },
    },
  ],
};
