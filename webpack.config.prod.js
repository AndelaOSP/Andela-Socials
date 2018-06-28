const path = require("path");
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractAppCSS = new ExtractTextPlugin({
  filename: 'css/app.css',
  allChunks: true
});
const ExtractVendorCSS = new ExtractTextPlugin({
  filename: 'css/vendor.css',
  allChunks: true
});

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'js/vendor.js',
      minChunks: function(module) {
        return typeof module.context === 'string' && module.context.indexOf('node_modules') >= 0;
      }
    }),
    ExtractAppCSS,
    ExtractVendorCSS,
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      comments: false,
      sourceMap: true
    })
  ],
  entry: [
    './client/index.js',
  ],
  target: 'web',
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'js/app.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: { presets: ['es2015', 'react'] }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
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
  },
  node: {
    fs: "empty",
  }
};
