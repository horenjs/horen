const path = require('path');
const merge = require("webpack-merge").merge;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const baseConfig = require("./base.config");

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map', // 调试定位错误行
  devServer:{
    contentBase: path.resolve(__dirname, '../dist'),
    hot: true, // 热替换重载
    compress: true, // gzip 压缩静态文件
    host: 'localhost', // 允许其他设备访问
    open: false, // 启动后打开浏览器,
    port: 8080, // 设置端口
  },
  // target: "electron-renderer",
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
                require.resolve("react-refresh/babel"),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
};

module.exports = merge(baseConfig, devConfig);