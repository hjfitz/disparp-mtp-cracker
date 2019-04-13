const path = require('path');

module.exports = {
  mode: 'development',
  entry: './lib/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'build.js',
  },
  devtool: 'source-map',
}