/* eslint-disable */
/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 15:46:47
 * @LastEditTime : 2022-01-21 22:28:32
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\webpack\config.js
 * @Description  : 
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "electron-main",
  devtool: "inline-source-map",
  mode: process.env.NODE_ENV || 'production',
  entry: {
    index: path.resolve(__dirname, './index.ts'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/main'),
    filename: '[name].js',
    clean: true, // clean the old files when build every time.
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '~': path.resolve(__dirname, './node_modules'),
      'types': path.resolve(__dirname, '../../shared/types'),
      'constant': path.resolve(__dirname, '../../shared/constant'),
    },
    extensions: ['.ts', '.js'],
    fallback: {
      fs: false,
      crypto: false,
      path: false,
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  externals: [nodeExternals()]
};

