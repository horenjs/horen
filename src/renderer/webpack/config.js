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
const HtmlWebPackPlugin = require('html-webpack-plugin');

const sourcePath = path.resolve(__dirname, '../../');
const constantPath = path.join(sourcePath, 'constant');
const typesPath = path.join(sourcePath, 'types');
const outputPath = path.join(sourcePath, '../dist');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: path.resolve(__dirname, '../public/index.html'),
});

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../index.tsx'),
  },
  output: {
    path: outputPath,
    filename: '[name].[contenthash:8].bundle.js',
    // clean: true, // clean the old files when build everytimes.
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../'),
      '~': path.resolve(__dirname, '../node_modules'),
      'types': typesPath,
      'constant': constantPath,
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      path: require.resolve('path-browserify'),
    }
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
  ],
};

