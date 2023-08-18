const path = require('path');

const constants = require('./shared');

module.exports = {
  entry: path.resolve(constants.TESTS_PATH, 'tests.js'),
  target: 'node',
  mode: 'production',
  output: {
    path: constants.TEMP_PATH,
    filename: 'testBundle.js',
  },
  resolveLoader: {
    alias: {
      'inject-loader': constants.DIST_PATH,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [constants.TESTS_PATH],
        options: {
          cacheDirectory: true,
          presets: [['@babel/preset-env', { modules: 'cjs' }]],
        },
      },
    ],
  },
};
