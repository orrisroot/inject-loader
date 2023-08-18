const path = require('path');
const constants = require('./shared');

module.exports = {
  entry: path.resolve(constants.SOURCE_PATH, 'index.js'),
  target: 'node',
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: constants.TEMP_PATH,
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  externals: constants.NODE_EXTERNAL_DEPS.map((dep) => ({
    [dep]: `commonjs ${dep}`,
  })),
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [constants.SOURCE_PATH, constants.TESTS_PATH],
        options: {
          cacheDirectory: true,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  node: '6',
                },
              },
            ],
          ],
          plugins: ['@babel/plugin-transform-flow-strip-types'],
        },
      },
    ],
  },
};
