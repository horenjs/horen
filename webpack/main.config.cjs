/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-19 22:08:17
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \mintin-alo\webpack\main.config.cjs
 * @Description  : 
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
// const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "production",
  target: "electron-main",
  devtool: "inline-source-map",
  entry: {
    index: path.resolve(__dirname, '../src/main/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
    clean: true, // clean the old files when build everytimes. 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/renderer'),
      '~': path.resolve(__dirname, '../node_modules'),
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript",
              ],
              plugins: [
                ["@babel/plugin-transform-runtime", {regenerator: true},]
              ],
            }
          }
        ]
      },
    ],
  },
  // externalsPresets: {
  //   node: true,
  // },
  // chalk 仍然需要转换
  // externals: [nodeExternals({
  //   allowlist: [/^lame/]
  // })],
  optimization: {
    minimize: false
  }
};
