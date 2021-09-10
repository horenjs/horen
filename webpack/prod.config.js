const merge = require("webpack-merge").merge;

const baseConfig = require("./base.config");

const prodConfig = {
  mode: 'production',
};

module.exports = merge(baseConfig, prodConfig);