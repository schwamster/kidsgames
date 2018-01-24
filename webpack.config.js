const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body',
  favicon: './src/favicon.ico'
});
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const PUBLIC_PATH = 'https://kidsgame.greenelephant.io/';


module.exports = {
  // entry: ['babel-polyfill', './src/index.js'],
  entry: ['./src/index.js'],
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js',
    publicPath: PUBLIC_PATH
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.(scss)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'style-loader', // inject CSS to page
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'sass-loader' // compiles SASS to CSS
        }]
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        exclude: /images/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',    // where the fonts will go
            publicPath: '../'       // override the default path
          }
        }]
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        include: [/images/],
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',    // where the fonts will go
            publicPath: '../'       // override the default path
          }
        }]
      },
      {
        test: /\.(mp3|ogg|wav)$/i,
        include: /sounds/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'sounds/',    // where the fonts will go
            publicPath: '../'       // override the default path
          }
        }]
      }

    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    HtmlWebpackPluginConfig,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      _: 'lodash'
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'kidsgame.greenelephant.io-cache-id',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: PUBLIC_PATH + 'index.html',
        staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
      }
    ),
    new WebpackPwaManifest({
      name: 'Kidsgames',
      short_name: 'Kidsgames',
      description: 'Simple games for kids that make math and typing fun',
      background_color: '#01579b',
      theme_color: '#01579b',
      'theme-color': '#01579b',
      start_url: '/',
      icons: [
        {
          src: path.resolve('src/components/assets/images/brand.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: 'images'
        }
      ]
    })
  ]
}

