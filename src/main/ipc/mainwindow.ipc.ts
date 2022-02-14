/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-29 00:37:56
 * @LastEditTime : 2022-01-30 01:36:02
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\main\ipc\mainwindow.ipc.ts
 * @Description  :
 */
import { ipcMain } from 'electron';
import { IPC_CODE } from 'constant';
import myapp from '../app';
import loggerUtil from '../utils/logger.util';

const mylogger = loggerUtil('ipc:mainwindow');

ipcMain.handle(IPC_CODE.mainwindow.close, async () => {
  mylogger.debug('main window close: ' + new Date());
  setTimeout(() => myapp.mainWindow?.destroy(), 500);
});

ipcMain.handle(IPC_CODE.mainwindow.minimize, async () => {
  mylogger.debug('main window minimize');
  myapp.mainWindow?.minimize();
});
