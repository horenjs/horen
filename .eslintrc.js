/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 09:47:41
 * @LastEditTime : 2022-01-21 15:47:43
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\.eslintrc.js
 * @Description  :
 */
// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: [
      './tsconfig.eslint.json',
      './packages/**/*/tsconfig.json',
    ]
  },
  rules: {},
  env: {},
  ignorePatterns: [
    "*/dist/**/*"
  ]
};
