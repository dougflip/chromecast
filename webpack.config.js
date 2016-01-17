var path = require('path');

module.exports = {
  entry: './sender/sender.js',
  output: {
    path: path.join(__dirname, 'sender'),
    filename: 'sender.bin.js'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'sender'),
        loader: 'babel-loader'
      }
    ]
  }
};
