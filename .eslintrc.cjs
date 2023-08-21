module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  plugins: ['node', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:node/recommended',
    'prettier',
  ],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-cycle': 'error',
    'node/no-unsupported-features/es-syntax': 'off',
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      settings: {
        node: {
          tryExtensions: ['.ts', '.json'],
        },
        'import/resolver': {
          node: {
            extensions: ['.ts', '.json'],
          },
        },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      },
    },
    {
      files: ['test/*.js'],
      plugins: ['mocha'],
      extends: ['plugin:mocha/recommended'],
    },
    {
      files: ['example/*/test/*.js'],
      env: {
        jasmine: true,
      },
      plugins: ['jasmine'],
      extends: ['plugin:jasmine/recommended'],
    },
  ],
};
