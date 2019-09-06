const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const BundleTracker = require('webpack-bundle-tracker');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackCommonConfig = require('./webpack.config.common');

const ExtractAppCSS = new ExtractTextPlugin({
  filename: 'css/app.css',
  allChunks: true
});
const ExtractVendorCSS = new ExtractTextPlugin({
  filename: 'css/vendor.css',
  allChunks: true
});

module.exports = merge(webpackCommonConfig, {
  output: {
    filename: 'js/app.js'
    path: path.join(__dirname, '../dist'),
  },
  devtool: 'source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new HtmlWebpackPlugin({
      template: '../public/index.html',
      filename: './index.html'
    }),
    new BundleTracker({ filename: '../webpack-stats.json' }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'js/vendor.js',
      minChunks: function(module) {
        return typeof module.context === 'string' && module.context.indexOf('node_modules') >= 0;
      }
    }),
    ExtractAppCSS,
    ExtractVendorCSS
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [/node_modules/, /build/, /__test__/]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractAppCSS.extract({
          fallback: 'style-loader',
          use: 'css-loader?sourceMap!csso-loader!sass-loader'
        })
      },
      {
        test: /\.css$/,
        loader: ExtractVendorCSS.extract({
          fallback: 'style-loader',
          use: 'css-loader?sourceMap!csso-loader'
        })
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: 'url-loader'
      }
    ]
  }
});
