var path = require('path')
var webpack = require('webpack')

module.exports = {
  mode: 'development',

  entry: './src/main.js',

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },

  devServer: {
    contentBase: './public',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]

  }
}
