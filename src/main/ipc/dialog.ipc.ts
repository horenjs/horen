/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 15:01:30
 * @LastEditTime : 2022-05-07 20:31:33
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\src\main\ipc\dialog.ipc.ts
 * @Description  :
 */
import { dialog } from 'electron';
import debug from '../utils/logger.util';
import myapp from '../app';

const mydebug = debug('ipc:dialog');

/**
 * 处理窗口打开
 * @returns Promise<Electron.OpenDialogReturnValue>
 */
export async function handleDialogOpen() {
  if (myapp.mainWindow) {
    return await dialog.showOpenDialog(myapp.mainWindow, {
      properties: ['openDirectory', 'multiSelections'],
    });
  } else {
    mydebug.warning('主窗口不存在 无法打开对话框');
  }
}
