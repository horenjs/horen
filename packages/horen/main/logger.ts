/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-30 01:28:14
 * @LastEditTime : 2022-01-30 01:39:47
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\logger.ts
 * @Description  :
 */
import chalk from 'chalk';
import ddebug from 'debug';

function logger(extend: string = '') {
  const dbrDebug = ddebug('horen');

  let myDebug: debug.Debugger;

  chalk.level = 3;

  if (extend !== '' && typeof extend === 'string') {
    const maxExtendSize = 10;
    // 最大字符不得超过 maxExtendSize
    // 超过的用 ... 代替
    // 不足的用 ' ' 补足
    if (extend.length <= maxExtendSize) {
      extend = extend + repeatStr(maxExtendSize - extend.length + 3);
    } else {
      extend = extend.substring(0, maxExtendSize) + repeatStr(3, '.');
    }

    myDebug = dbrDebug.extend(extend);
  } else {
    myDebug = dbrDebug;
  }

  function debug(s: string) {
    // console.log(s);
    myDebug('[debug] ' + s);
  }

  function info(s: string) {
    // console.log(s);
    myDebug(chalk.cyan('[info] ' + s));
  }

  function warning(s: string) {
    // console.log(s);
    myDebug(chalk.yellow('[warning] ' + s));
  }

  function error(s: string) {
    myDebug(chalk.red('[error] ' + s));
  }

  function critic(s: string) {
    myDebug(chalk.redBright('[critic] ' + s));
  }

  const createLogger = {
    debug,
    info,
    warning,
    error,
    critic,
  };

  return createLogger;
}

function repeatStr(times: number, symbol = ' ') {
  let str = '';
  for (let i = 0; i < times; i++) {
    str += symbol;
  }
  return str;
}

export default logger;
