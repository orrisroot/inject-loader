const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',

  entry: {
    main: './test/main_test',
  },

  plugins: [
    new webpack.DefinePlugin({
      __VALUEA__: 10,
    }),
  ],

  output: {
    path: path.resolve(__dirname, './dest'),
  },

  resolve: {
    extensions: ['.js'],
    modules: [
      __dirname,
      path.resolve(__dirname, './node_modules'),
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, './test'),
    ],
  },

  resolveLoader: {
    alias: {
      'inject-loader': path.resolve(__dirname, '../../lib'),
    },
  },
};
