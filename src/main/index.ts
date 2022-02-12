/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-10 12:45:39
 * @LastEditTime : 2022-01-30 01:36:59
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\main\lyric.ts
 * @Description  : Electron 主入口文件
 */
import myapp from './app';
import './ipc';
import logger from './logger';

logger('start').info('start the app');
myapp.start();
