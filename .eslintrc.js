// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  ignorePatterns: ['/dist/*', '/android/*', '/node_modules/*', '.eslintrc.js'],
  rules: {
    'prettier/prettier': 'warn',
  },
};

