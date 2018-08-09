const webpack = require('webpack');

require('dotenv').config();

const isInDebugMode = debugString => debugString === 'TRUE';
const DEBUG = JSON.stringify(process.env.DEBUG);

module.exports = {
  entry: '../index.js',
  target: 'web',
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: !isInDebugMode(DEBUG),
      debug: isInDebugMode(DEBUG),
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          G_SUITE_DOMAIN: JSON.stringify(process.env.G_SUITE_DOMAIN),
          CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
          API_URI: JSON.stringify(process.env.REACT_APP_API_URI),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          DEBUG,
        },
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /(\.css|scss)$/, loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpeg|png|gif|svg|jpg)$/, loader: 'url-loader?limit=25000',
      },
      {
        test: /\.otf$/, loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml',
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
