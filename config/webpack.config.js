const path = require('path');

const constants = require('./shared');

module.exports = {
  entry: path.resolve(constants.SOURCE_PATH, 'index.ts'),
  target: 'node',
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: constants.DIST_PATH,
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: constants.NODE_EXTERNAL_DEPS.map((dep) => ({
    [dep]: `commonjs ${dep}`,
  })),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
};
