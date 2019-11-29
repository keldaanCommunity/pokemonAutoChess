const path = require('path');

module.exports = {
    mode: 'development',
    entry: './client/src/index.js',
    devServer: {
    contentBase: './client/dist',
    compress: true,
    port: 9000,
  },
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: 'main.js'
  }
};
