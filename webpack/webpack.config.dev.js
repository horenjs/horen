/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: path.resolve(__dirname, '../public/index.html'),
});

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../renderer/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash].bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../renderer'),
      '~': path.resolve(__dirname, '../node_modules'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.svg'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg)$/,
        use: ['file-loader'],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", 'css-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: path.resolve(__dirname, '../renderer/icons'),
        options: {
          symbolId: 'icon-[name]',
        }
      },
      {
        test: /\.(ts|tsx)$/,
        use: ['ts-loader', 'eslint-loader'],
      },
    ],
  },
  plugins: [htmlWebpackPlugin],
};
