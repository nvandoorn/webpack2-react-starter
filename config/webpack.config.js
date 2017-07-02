const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('interpolate-html-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const joinDir = dir => path.join(__dirname, '..', dir)
const SRC_PATH = joinDir('src')
const BUILD_PATH = joinDir('build')
const PUBLIC_PATH = joinDir('public')
const NODE_PATH = joinDir('node_modules')
const FILE_FORMAT = '[name].[hash:8].[ext]'

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: isProduction ? false : 'cheap-eval-source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: BUILD_PATH
  },
  module: {
    rules: [
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, // load the fonts
      use: [{
        loader: 'file-loader',
        query: {
          name: path.join('fonts', FILE_FORMAT)
        }
      }]
    },
    {
      exclude: [ // load other static assets
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
          name: path.join('media', FILE_FORMAT)
        }
      }]
    },
    {
      test: /\.css$/, // load css libs without css modules or postcss
      include: NODE_PATH,
      use: ExtractTextPlugin.extract({
        use: ['css-loader']
      })
    },
    {
      test: /\.(css\.js|css)$/, // TODO remove .css.js from regex after migrating
      include: SRC_PATH,
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
      test: /\.css\.js$/, // TODO remove after migrating to postcss
      use: ['css-js-loader']
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
    },
    {
      test: /\.(js|jsx)$/, // lint the js before babel
      enforce: 'pre',
      use: ['eslint-loader'],
      include: SRC_PATH
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

if(isProduction) module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin())
