const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  }
};
