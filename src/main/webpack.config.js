/* eslint-disable */
/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 15:46:47
 * @LastEditTime : 2022-01-21 22:28:32
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\webpack\config.js
 * @Description  : 
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const sourcePath = path.resolve(__dirname, '../');
const constantPath = path.join(sourcePath, 'constant');
const typesPath = path.join(sourcePath, 'types');
const outputPath = path.join(sourcePath, '../dist');

module.exports = {
  target: "electron-main",
  devtool: "inline-source-map",
  mode: process.env.NODE_ENV || 'production',
  entry: {
    index: path.resolve(__dirname, './index.ts'),
  },
  output: {
    path: outputPath,
    filename: 'main.js',
    // clean: true, // clean the old files when build every time.
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '~': path.resolve(__dirname, './node_modules'),
      'types': typesPath,
      'constant': constantPath,
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

