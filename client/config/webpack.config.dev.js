const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const webpackCommonConfig = require('./webpack.config.common');

module.exports = merge(webpackCommonConfig, {
  devtool: 'cheap-module-eval-source-map',
  context: __dirname,
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'bundle.js',
    chunkFilename: '[name].[hash].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.html',
      filename: './index.html',
    }),
    new BundleTracker({ filename: '../webpack-stats.json' }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: '0.0.0.0',
    publicPath: 'http://0.0.0.0:9000/',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Content-Type, Authorization, accept, accept-encoding, authorization, dnt, origin, user-agent, x-csrftoken, x-requested-with',
    },
    compress: true,
    port: 9000,
    proxy: {
      '/api/v1': {
        target: 'http://0.0.0.0:8000',
        secure: false,
      },
    },
    clientLogLevel: 'none',
    hot: true,
    inline: true,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
});
