/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-15 01:23:45
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \MintForge\packages\mintin-alo\webpack\prod.config.cjs
 * @Description  : 
 */
const merge = require("webpack-merge").merge;

const baseConfig = require("./base.config.cjs");

const prodConfig = {
  mode: 'production',
};

module.exports = merge(baseConfig, prodConfig);