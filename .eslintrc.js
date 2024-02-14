module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  ignorePatterns: ['.eslintrc.js', 'dist', 'out', 'node_modules'],
  rules: {
    indent: ['error', 2],
    // "linebreak-style": ["error", "unix"],
    // quotes: ["error", "double"]
  },
};
