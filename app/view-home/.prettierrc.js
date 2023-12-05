/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 19:14:15
 * @LastEditTime : 2022-06-07 23:17:31
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-ts\.prettierrc.js
 * @Description  :
 */
module.exports = {
  printWidth: 80,                         // 每行字符数
  tabWidth: 2,                            // tab 的宽度
  useTabs: false,                         // 是否使用 tab
  semi: true,                             // 分号
  singleQuote: false,                     // 单引号
  quoteProps: 'as-needed',                // 引号属性（针对特殊格式如 md 等）
  jsxSingleQuote: false,                  // jsx 使用单引号
  trailingComma: 'es5',                   // 
  bracketSpacing: true,                   // 大括号里面加一个空格
  bracketLine: true,                      // 大括号跨行
  arrowParens: 'always',                  // 箭头函数的参数是否用括号括起来
  rangeStart: 0,                          // 对文件的作用开始处
  rangeEnd: Infinity,                     // 对文件的作用结束处
  // parser: '',                          //
  // filePath: '',                        //
  // requirePragma: <bool>                //
  // insertPragma: <bool>                 //
  proseWrap: 'preserve',                  //
  htmlWhitespaceSensitivity: 'css',       // html 空格敏感
  endOfLine: 'lf',                        // 换行方式 'lf' - unix
  embeddedLanguageFormatting: 'auto',     // 在其他格式中引用代码是否格式化
};
