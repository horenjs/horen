/* eslint-disable */
/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 15:52:15
 * @LastEditTime : 2022-01-21 17:00:50
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\webpack\config.dev.js
 * @Description  :
 */
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
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
      to: path.resolve(__dirname, '../../dist/renderer'),
      globOptions: {
        ignore: ["index.html"],
      }
    }
  ]
});

module.exports = {
  mode: 'development',
  target: "electron-renderer",
  devtool: 'inline-source-map',                 // 调试定位错误行
  devServer: {
    hot: true,                                  // 热替换重载
    compress: true,                             // gzip 压缩静态文件
    host: 'localhost',                          // 允许其他设备访问
    open: false,                                // 启动后打开浏览器,
    port: 8080,                                 // 设置端口
  },
  entry: {
    index: path.resolve(__dirname, '../index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, '../../dist/renderer'),
    filename: 'js/[name].[contenthash:8].bundle.js',
    clean: true, // clean the old files when build everytimes. 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../'),
      '~': path.resolve(__dirname, '../node_modules'),
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
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                ["@babel/plugin-transform-runtime", {regenerator: true}],
                require.resolve('react-refresh/babel')
              ],
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ]
            },
          },
        ],
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
    new ReactRefreshWebpackPlugin(),
    htmlWebpackPlugin,
    // copyWebpackPlugin,
  ],
};
