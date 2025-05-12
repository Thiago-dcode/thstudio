module.exports = {
  extends: ["@repo/eslint-config/typescript"],
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
