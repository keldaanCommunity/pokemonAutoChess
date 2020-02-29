const path = require("path");

let commonConfig = {
  context: path.resolve(__dirname, "app", "public", "src"),
  watchOptions: {
    aggregateTimeout: 1500,
    poll: 1000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};

let indexConfig = Object.assign({}, commonConfig, {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "app", "public", "dist"),
    filename: "index.js"
  },
});

let gameConfig = Object.assign({}, commonConfig, {
  entry: "./game.js",
  output: {
    path: path.join(__dirname, "app", "public", "dist"),
    filename: "game.js"
  },
});

module.exports = [indexConfig, gameConfig];
