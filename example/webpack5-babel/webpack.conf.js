const path = require('path');

// eslint-disable-next-line node/no-unpublished-require
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    main: './test/main.test.js',
  },
  output: {
    path: path.resolve(__dirname, 'dest'),
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      __VALUE_A__: 10,
    }),
  ],
  resolveLoader: {
    alias: {
      '@orrisroot/inject-loader': path.resolve(__dirname, '../../lib'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { modules: 'cjs' }]],
        },
      },
    ],
  },
};
