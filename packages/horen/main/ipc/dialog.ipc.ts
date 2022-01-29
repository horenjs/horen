/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 15:01:30
 * @LastEditTime : 2022-01-30 01:31:28
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\ipc\dialog.ipc.ts
 * @Description  :
 */
import { ipcMain, dialog } from 'electron';
import { IPC_CODE } from '../../constant';
import debug from '../logger';
import myapp from '../app';

const mydebug = debug('ipc:dialog');
/**
 * 监听对话框打开
 */
ipcMain.handle(IPC_CODE.dialog.open, async (evt, flag = 'dir') => {
  if (myapp.mainWindow) {
    return await dialog.showOpenDialog(myapp.mainWindow, {
      properties: ['openDirectory', 'multiSelections'],
    });
  } else {
    mydebug.warning('主窗口不存在 无法打开对话框');
  }
});
