module.exports = {
  root: true,
  extends: ['@comtech/eslint-config'],
  parserOptions: {
    project: ['./tsconfig.base.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
