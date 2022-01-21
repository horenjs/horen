/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-10 12:45:39
 * @LastEditTime : 2022-01-22 02:13:56
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\index.ts
 * @Description  : Electron 主入口文件
 */
import { App } from './app';
import './ipc';

new App({
  loadURL: 'http://localhost:8080'
});