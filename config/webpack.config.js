const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('interpolate-html-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const SRC_PATH = path.join(__dirname, '..', 'src')
const BUILD_PATH = path.join(__dirname, '..', 'build')
const PUBLIC_PATH = path.join(__dirname, '..', 'public')
const NODE_PATH = path.join(__dirname, '..', 'node_modules')

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: BUILD_PATH
  },
  module: {
    rules: [
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{
        loader: 'file-loader',
        query: {
          name: 'fonts/[name].[hash:8].[ext]'
        }
      }]
    },
    {
      exclude: [
        /\.ttf$/,
        /\.eot$/,
        /\.html$/,
        /\.(js|jsx)$/,
        /\.css$/,
        /\.json$/,
        /\.svg$/
      ],
      use: [{
        loader:'url-loader',
        query: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]'
        }
      }]
    },
    {
      test: /\.(js|jsx)$/,
      enforce: 'pre',
      use: ['eslint-loader'],
      include: SRC_PATH
    },
    {
      test: /\.css$/,
      include: NODE_PATH,
      use: ExtractTextPlugin.extract({
        use: ['css-loader']
      })
    },
    {
      test: /\.css$/,
      exclude: NODE_PATH,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          query: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        },
        {
          loader: 'postcss-loader',
          options:{
            plugins: () => [
              require('postcss-nesting'),
              require('postcss-cssnext'),
              require('precss')
            ]
          }
        }]
      })
    },
    {
      test: /\.(js|jsx)$/,
        include: SRC_PATH,
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: ['transform-decorators-legacy'],
            presets: [
              'es2015',
              'react'
            ],
            cacheDirectory: true
          }
        }]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new ExtractTextPlugin('style.css'),
    new InterpolateHtmlPlugin({
      APP_TITLE: process.env.APP_TITLE
    }),
    new HtmlWebpackPlugin({
      template: path.join(PUBLIC_PATH, 'index.html'),
      inject: 'body'
    })
  ]
}

if(process.env.NODE_ENV === 'production') module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin())
