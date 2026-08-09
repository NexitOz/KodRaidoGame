module.exports = {
  root: true,
  extends: ['../../packages/config/eslint-preset.cjs'],
  parserOptions: { ecmaFeatures: { jsx: true } },
  env: { browser: true, node: true, es2022: true },
  plugins: ['react', 'react-hooks'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
