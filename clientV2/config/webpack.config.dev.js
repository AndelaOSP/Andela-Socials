const webpack = require('webpack');
const merge = require('webpack-merge');
const BundleTracker = require('webpack-bundle-tracker');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpackCommonConfig = require('./webpack.config.common');

module.exports = merge(webpackCommonConfig, {
  devtool: 'cheap-module-eval-source-map',
  context: __dirname,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleTracker({ filename: '../webpack-stats.json' }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: '../public/index.html',
      filename: './index.html',
    }),
  ],
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist/'),
    chunkFilename: '[name].[hash].js',
  },
  devServer: {
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Content-Type, Authorization, accept, accept-encoding, authorization, dnt, origin, user-agent, x-csrftoken, x-requested-with'
    },
    publicPath: 'http://0.0.0.0:9000/',
    port: 9000,
    compress: true,
    proxy: {
      '/api/v1': {
        target: 'http://0.0.0.0:8000',
        secure: false,
      },
    },
    hot: true,
    inline: true,
    historyApiFallback: true,
    watchOptions: { ignored: /node_modules/ },
  },
});
