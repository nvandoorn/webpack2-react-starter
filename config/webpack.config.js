const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const SRC_PATH = path.join(__dirname, '..', 'src')
const BUILD_PATH = path.join(__dirname, '..', 'build', 'static')
const PUBLIC_PATH = path.join(__dirname, '..', 'public')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: BUILD_PATH
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ['eslint-loader'],
      include: SRC_PATH
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader']
      })
    },
    {
      test: /\.css\.js$/,
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
            plugins: () => [require('postcss-nesting'), require('autoprefixer')]
          }
        }]
      })
    },
    {
      test: /\.css\.js$/,
      use: ['css-js-loader']
    },
    {
      test: /\.(js|jsx)$/,
        include: SRC_PATH,
        use: [{
          loader: 'babel-loader',
          query: {
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
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      template: path.join(PUBLIC_PATH, 'index.html'),
      filename: '../index.html',
      inject: 'body'
    })
  ]
}

if(process.env.NODE_ENV === 'production') module.exports.plugins.push(new UglifyJSPlugin())
