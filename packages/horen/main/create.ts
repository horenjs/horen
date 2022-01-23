/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:26:10
 * @LastEditTime : 2022-01-23 16:30:15
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
    minWidth: opts?.minWidth || 1156,
    minHeight: opts?.minHeight || 764,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  });
}
