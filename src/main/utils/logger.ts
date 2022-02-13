/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-30 01:28:14
 * @LastEditTime : 2022-01-30 17:32:04
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\src\horen\main\logger.ts
 * @Description  :
 */
import chalk from 'chalk';
import ddebug from 'debug';
import util from "util";
import { LOG_PATH } from 'constant';
import fs from 'fs';
import path from 'path';

function logger(extend = '') {
  const dbrDebug = ddebug('horen');

  let myDebug: ddebug.Debugger;

  chalk.level = 3;

  if (extend !== '') {
    /*
    const maxExtendSize = 10;
    // 最大字符不得超过 maxExtendSize
    // 超过的用 ... 代替
    // 不足的用 ' ' 补足
    if (extend.length <= maxExtendSize) {
      extend = extend + repeatStr(maxExtendSize - extend.length + 3);
    } else {
      extend = extend.substring(0, maxExtendSize) + repeatStr(3, '.');
    } */
    myDebug = dbrDebug.extend(extend);
  } else {
    myDebug = dbrDebug;
  }

  myDebug.log = function (...args) {
    writeToFile(LOG_PATH, util.format(...args) + '\n');
    return process.stderr.write(util.format(...args) + '\n');
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

  function writeToFile(p: string, data: string) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, {recursive: true});
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth()).length < 2 ? `0${date.getMonth()}` : date.getMonth();
    const day = date.getDate();
    fs.writeFile(path.join(p, `${year}-${month}-${day}.log`), data, {encoding: 'utf-8', flag: 'a+'}, (err) => {
      if (err) console.error(err);
    })
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
