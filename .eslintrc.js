module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    // Had to disable to allow the use of TS interface only usages
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
  ignorePatterns: ["dist/", "node_modules/"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaVersion: 2017,
  },
  plugins: ["@typescript-eslint"],
  globals: {
    google: "readonly",
    afterAll: "readonly",
    afterEach: "readonly",
    beforeAll: "readonly",
    beforeEach: "readonly",
    describe: "readonly",
    expect: "readonly",
    it: "readonly",
    jest: "readonly",
  },
};
