/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:26:10
 * @LastEditTime : 2022-01-22 02:38:48
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\create.ts
 * @Description  :
 */
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

export function createWindow(opts?: BrowserWindowConstructorOptions) {
  return new BrowserWindow({
    ...opts,
    width: opts?.width || 900,
    height: opts?.height || 700,
    minWidth: opts?.minWidth || 850,
    minHeight: opts?.minHeight || 650,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  });
}
