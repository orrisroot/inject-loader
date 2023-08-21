const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: {
    '@babel/core': 'commonjs @babel/core',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
};
