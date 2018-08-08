const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const webpackCommonConfig = require('./webpack.config.common');


module.exports = merge(webpackCommonConfig, {
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'js/app.js',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      comments: false,
      sourceMap: true,
    }),
  ],
});
