const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ESLintPlugin = require("eslint-webpack-plugin");
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const projectPath = path.resolve(__dirname, '..');
const distPath = path.join(projectPath, 'dist');
const srcPath = path.join(projectPath, 'src');
const publicPath = path.join(projectPath, 'public');

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];

const alias = {
  '@api': path.join(srcPath, 'api'),
  '@pages': path.join(srcPath, 'pages'),
  '@components': path.join(srcPath, 'components'),
  '@routes': path.join(srcPath, 'routes'),
  '@store': path.join(srcPath, 'store'),
}

const rules = () => {
  return [
    {
      test: /\.(ts|tsx)$/,
      include: [srcPath],
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: (() => {
              // 使用一个立即执行函数来返回 plugin 列表
              const plugins = ['@babel/plugin-transform-runtime'];
              if (isDev) plugins.push('react-refresh/babel');
              return plugins;
            })(),
          }
        }
      ]
    },
    {
      test: /\.less$/,
      include: [srcPath],
      exclude: /node_modules/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        "css-loader",
        "less-loader",
      ]
    }
  ]
};

const plugins = () => {
  const results = [
    new HtmlWebpackPlugin({ template: `${publicPath}/index.html` }),
    new ESLintPlugin({
      context: srcPath,
      extensions: ["tsx", "ts"],
    }),
  ];

  if (isProd) {
    results.push(new MiniCssExtractPlugin({
      filename: 'css/style.[contenthash:8].css',
    }));
    results.push(new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: path.join(distPath, "_bundle_report.html"),
      openAnalyzer: false,
    }));
  }
  
  if (isDev) {
    results.push(new ReactRefreshPlugin());
  }

  return results;
};



const devServer = {
  client: {
    // 当出现编译错误或警告时，在浏览器中显示全屏覆盖。
    overlay: true,
    // 在浏览器中以百分比显示编译进度。
    progress: true,
    // 重新连接客户端的次数。当为 true 时，它将无限次尝试重新连接。
    reconnect: true,
  },
  // 启用gzip 压缩
  compress: true,
  port: process.env.PORT || 9526,
  // 启用webpack的模块热替换
  hot: true,
  // 服务器已经启动后打开默认的浏览器
  open: false,
  // 代理---处理跨域转发
  proxy: {}
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  context: projectPath,
  entry: {
    app: path.join(srcPath, 'index.tsx'),
  },
  output: {
    path: distPath,
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: 'chunk/[name].[chunkhash:8].js',
  },
  resolve: {
    extensions: extensions,
    alias: alias,
  },
  module: {
    rules: rules(),
  },
  plugins: plugins(),
  cache: {
    type: 'filesystem',
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      minSize: 20000,
      cacheGroups: {
        react: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devServer: isDev ? devServer : {},
}