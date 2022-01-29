/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-29 00:37:56
 * @LastEditTime : 2022-01-29 15:37:03
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\ipc\mainwindow.ipc.ts
 * @Description  : 
 */
import { ipcMain } from "electron";
import { IPC_CODE } from "../../constant";
import myapp from '../app';

ipcMain.handle(IPC_CODE.mainwindow.close, async (evt) => {
  myapp.mainWindow?.destroy();
})

ipcMain.handle(IPC_CODE.mainwindow.minimize, async (evt) => {
  myapp.mainWindow?.minimize();
})