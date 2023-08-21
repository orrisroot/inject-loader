const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    'loader-require': `./test/require.test.js`,
    'loader-import': `./test/import.test.js`,
  },
  output: {
    path: path.resolve(__dirname, 'tmp'),
    filename: '[name].js',
  },
  resolveLoader: {
    alias: {
      self: path.resolve(__dirname, 'lib'),
    },
  },
};
