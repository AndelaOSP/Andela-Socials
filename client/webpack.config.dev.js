const path = require("path");
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const env = require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  devtool: 'cheap-module-eval-source-map',
  context: __dirname,
  entry: './index.js',
  target: 'web',
  output: {
  path: path.join(__dirname, '/dist/'),
  filename: 'bundle.js',
  publicPath: '/',
},
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html'
    }),
    new webpack.DefinePlugin({
      'process': {
        'env': {
          'G_SUITE_DOMAIN': JSON.stringify(process.env.G_SUITE_DOMAIN),
          'CLIENT_ID': JSON.stringify(process.env.CLIENT_ID)
        }
      }
    }),
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
  ],
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['es2015', 'react'] } },
      { test: /(\.css|scss)$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(jpeg|png|gif|svg|jpg)$/, loader: 'url-loader?limit=25000' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ],
  },
  devServer: {
    host: "0.0.0.0",
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
      }
    },
    clientLogLevel: 'none',
    hot: true,
    inline: true,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
    extensions: ['.js', '.jsx']
  },
  node: {
    fs: 'empty',
  },
}
