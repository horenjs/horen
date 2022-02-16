/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-29 00:37:56
 * @LastEditTime : 2022-01-30 01:36:02
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\main\ipc\mainwindow.ipc.ts
 * @Description  :
 */
import { ipcMain, Rectangle } from 'electron';
import { IPC_CODE } from 'constant';
import myapp from '../app';
import loggerUtil from '../utils/logger.util';
import { resp } from '../utils';
import {mydebug} from "./track.ipc";

const mylogger = loggerUtil('ipc:mainwindow');

ipcMain.handle(IPC_CODE.mainwindow.close, async () => {
  mylogger.debug('main window close: ' + new Date());
  setTimeout(() => myapp.mainWindow?.destroy(), 500);
});

ipcMain.handle(IPC_CODE.mainwindow.minimize, async () => {
  mylogger.debug('main window minimize');
  myapp.mainWindow?.minimize();
});

ipcMain.handle(IPC_CODE.mainwindow.setBounds, async (evt, bounds: Rectangle) => {
  mylogger.debug(`set the main window size: x: ${bounds.x}, y: ${bounds.y}, width: ${bounds.width}, height: ${bounds.height}`);
  try {
    myapp.mainWindow?.setBounds(bounds);
    mydebug.debug('set bounds success');
    return resp(1, 'set bounds success');
  } catch (err) {
    mydebug.error('set bounds failed');
    return resp(0, 'set bounds failed');
  }
})

ipcMain.handle(IPC_CODE.mainwindow.getBounds, async () => {
  const rectangle = myapp.mainWindow?.getBounds();
  if (rectangle) {
    mydebug.debug('get bounds success');
    return resp(1, 'get bounds success', rectangle);
  }
})
