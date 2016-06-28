const webpack = require('webpack');

module.exports = {
  entry: './client/js/app.js',
  output: {
    path: './build/js',
    filename: 'app.bundle.js',
  },
  module: {
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