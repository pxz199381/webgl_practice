const Path = require('path');
const Webpack = require('webpack');
const {merge} = require('webpack-merge');
const BasicWebpackConfig = require('./webpack.config.basic.js');

console.log('merge', merge);


module.exports = merge(BasicWebpackConfig, {
  // devtool: '#source-map',
  devtool: 'cheap-source-map',
  mode: 'development',
  output: {
    publicPath: '/'
  },
  devServer: {
    hot: true,
    port: 9999,
    inline: true,
    clientLogLevel: 'error',
    index: 'index.html'
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new Webpack.HotModuleReplacementPlugin(),
    // new Webpack.NamedModulesPlugin(),
    new Webpack.NoEmitOnErrorsPlugin()
  ]
});