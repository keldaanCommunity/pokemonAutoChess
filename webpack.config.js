const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

const configDev = {
  mode: 'development',
  entry: path.resolve(__dirname, 'app', 'public', 'src', 'index.tsx'),
  watchOptions: {
    aggregateTimeout: 1500,
    poll: 1000
  },
  output: {
    path: path.join(__dirname, 'app', 'public', 'dist', 'client'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {test: /\.tsx?$/, loader: 'ts-loader',exclude: /node_modules/,},
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {test: /\.js$/, loader: 'source-map-loader',exclude: /node_modules/,}
    ]
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    //new BundleAnalyzerPlugin()
  ]
};

const configProd = {
  ...configDev,
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};

module.exports = (env) => {
  // return configProd
  return env.production ? configProd : configDev;
};
