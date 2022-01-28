/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-10 12:45:39
 * @LastEditTime : 2022-01-28 14:54:48
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\index.ts
 * @Description  : Electron 主入口文件
 */
import myapp from './app';
import './ipc';

myapp.start();
