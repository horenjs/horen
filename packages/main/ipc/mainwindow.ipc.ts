/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-29 00:37:56
 * @LastEditTime : 2022-01-30 01:36:02
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\ipc\mainwindow.ipc.ts
 * @Description  :
 */
import { ipcMain } from 'electron';
import { IPC_CODE } from '../../shared/constant';
import myapp from '../app';
import logger from '../logger';

const mylogger = logger('ipc:mainwindow');

ipcMain.handle(IPC_CODE.mainwindow.close, async (evt) => {
  mylogger.debug('main window close: ' + new Date());
  myapp.mainWindow?.destroy();
});

ipcMain.handle(IPC_CODE.mainwindow.minimize, async (evt) => {
  mylogger.debug('main window minimize');
  myapp.mainWindow?.minimize();
});
