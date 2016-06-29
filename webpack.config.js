const webpack = require('webpack');
const path = require("path");

module.exports = {
  entry: './client/js/app.js',
  output: {
    path: path.resolve(__dirname, 'build/js'),
    filename: 'app.bundle.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/
        loader: 'eslint-loader',
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
    ]
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //         warnings: false,
  //     },
  //     output: {
  //         comments: false,
  //     },
  //   }),
  // ]
}