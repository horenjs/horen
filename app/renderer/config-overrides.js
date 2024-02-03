const webpack = require('webpack');
const { override } = require('customize-cra');
const path = require('path');
const paths = require('react-scripts/config/paths');
const {
  aliasDangerous,
  configPaths,
} = require('react-app-rewire-alias/lib/aliasDangerous');

const processDefine = Object.entries(process.env).reduce(
  (res, [key, value]) => ({
    ...res,
    [`process.env.${key}`]: JSON.stringify(value),
  }),
  {}
);

module.exports = {
  webpack: override((config, env) => {
    if (env === 'production') {
      paths.appBuild = path.join(__dirname, '../../dist');
      config.output.path = paths.appBuild;
      config.output.publicPath = './';
      // config.plugins.push(new webpack.DefinePlugin(processDefine));

      // aliasDangerous(configPaths('tsconfig.paths.json'))(config);

      return config;
    }
    return config;
  }),
};
