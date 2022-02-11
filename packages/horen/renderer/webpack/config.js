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
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const distPath = path.resolve(__dirname, '../../dist/renderer')

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: path.resolve(__dirname, '../public/index.html'),
});

// 用于复制文件
const copyWebpackPlugin = new CopyWebpackPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, '../public'),
      to: distPath,
      globOptions: {
        ignore: ['**/index.html'],
      }
    }
  ]
});

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../index.tsx'),
  },
  output: {
    path: distPath,
    filename: 'js/[name].[contenthash:8].bundle.js',
    clean: true, // clean the old files when build everytimes. 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../'),
      '~': path.resolve(__dirname, '../node_modules'),
      'types': path.resolve(__dirname, '../../../shared/types'),
      'constant': path.resolve(__dirname, '../../../shared/constant')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              plugins: [
                ["@babel/plugin-transform-runtime", {regenerator: true}],
              ],
            }
          }
        ]
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
    // copyWebpackPlugin,
  ],
};

