/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-15 10:12:57
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \MintForge\packages\mintin-alo\.babelrc.cjs
 * @Description  : 
 */
module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-transform-runtime", {regenerator: true},]
  ],
}