module.exports = {
  extends: ["@repo/eslint-config/base.js"],
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
