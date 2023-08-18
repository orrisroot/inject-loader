const path = require('path');

const constants = require('./shared');

module.exports = {
  entry: path.resolve(constants.TESTS_PATH, 'tests.esm.js'),
  target: 'node',
  mode: 'production',
  output: {
    path: constants.TEMP_PATH,
    filename: 'testBundleESM.js',
  },
  resolveLoader: {
    alias: {
      'inject-loader': constants.DIST_PATH,
    },
  },
};
