const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = function(env) {
  // set variables, modifying the config for dev and prod
  let environment;
  if (isProduction) environment = 'production';
  else environment = 'development';

  return {
    target: ['web'],
    mode: environment,
    entry: path.join(__dirname, 'src', 'app.jsx'),
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: environment === 'production' ? '/rnacentral-sequence-features/dist/' : '/',
      filename: 'rnacentral-sequence-features.js'
    },
    resolve: {
      modules: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules')]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: "body",
        template: path.join(__dirname, 'src', 'index.html'),
        filename: environment === 'production' ? path.join(__dirname, "index.html") : "index.html"
      }),
      new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', jquery: 'jquery' }),
      new dotenv()
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          }
        },
        {
          test: /\.(s?css|sass)$/,
          use: [
            { loader: 'css-loader', options: {sourceMap: true} },
            { loader: 'sass-loader', options: {sourceMap: true} }
          ]
        },
      ]
    },
    // Don't forget that you can look up your files here:
    // localhost:8080/webpack-dev-server
    devServer: {
      static: {
        directory: path.join(__dirname, 'src'),
      },
      compress: true,
      port: 8080,
    },
    devtool: "source-map"
  };
};
