const webpackConfig = require('./webpack.conf.js');

webpackConfig.entry = undefined;

module.exports = function karmaConfig(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],

    files: [{ pattern: 'test/*.test.js', watched: false }],

    preprocessors: {
      'test/*.test.js': ['webpack'],
    },
    client: {
      clearContext: false,
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['jsdom'],
    singleRun: true,
    concurrency: Infinity,
    webpack: webpackConfig,
    hostname: 'localhost',
    listenAddress: 'localhost',
  });
};
