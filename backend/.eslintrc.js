module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'rules': {
    'max-len': ['error', {'code': 120}],
    'require-jsdoc': 0,
    // 'no-unused-vars': 0,
  },
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
};
