/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-18 22:22:21
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \MintForge\packages\mintin-alo\webpack\base.config.cjs
 * @Description  : 
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: path.resolve(__dirname, '../public/index.html'),
});

// 用于复制文件
const copyWebpackPlugin = new CopyWebpackPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, '../public'),
      to: path.resolve(__dirname, '../dist'),
      globOptions: {
        ignore: ['**/index.html'],
      }
    }
  ]
});

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/renderer/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash:8].bundle.js',
    clean: true, // clean the old files when build everytimes. 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/renderer'),
      '~': path.resolve(__dirname, '../node_modules'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|png|jpeg|svg)$/,
        use: ["file-loader"],
      }
    ],
  },
  plugins: [
    htmlWebpackPlugin,
    copyWebpackPlugin,
  ],
};
