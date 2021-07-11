const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin')

const SourceDir = Path.resolve(__dirname, '../src/');

module.exports = {
  context: Path.join(__dirname, '../src'),
  entry: {
    'index': Path.resolve(__dirname, '../src/js/index.js'),
    'webgl-utils': Path.resolve(__dirname, '../src/js/webgl-utils.js'),
    'webgl-lessons-ui': Path.resolve(__dirname, '../src/js/webgl-lessons-ui.js'),
  },
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: './'
  },
  target: 'web',
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: ['babel-loader', 'awesome-typescript-loader']
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.glsl$/,
      loader: 'raw-loader'
      }, {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: { //注意，此处使用insert，不能使用insertAt，否则会报错
              insert: 'top'//Style-loader 将 <style> 元素附加到样式目标(style target)的末尾，即页面的 <head> 标签，。这将导致 loader 创建的 CSS 优先于目标中已经存在的 CSS。
            }
          }, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },

    {
      test: /\.(png|jpe?g|gif)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[ext]',
      }
    }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
      filename: 'index.html'
    })
  ],
  resolve: {
    extensions: [".ts", ".json", ".scss", ".glsl", '.js'],
    // alias: {
    //   RESOURCE: path.resolve(SourceDir, 'resource'),
    // },
    plugins: [
      new TsConfigPathsPlugin({
        configFileName: Path.resolve(__dirname, '../tsconfig.json')
      }),
      // new CopyWebpackPlugin({
      //   patterns: [
      //     { from: "source", to: "dest" },
      //     // { from: "other", to: "public" },
      //   ],
      //   options: {
      //     concurrency: 100,
      //   },
      // }),
    ]
  }
};