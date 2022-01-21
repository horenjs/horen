/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:26:10
 * @LastEditTime : 2022-01-21 17:43:05
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\create.ts
 * @Description  : 
 */
import { BrowserWindow } from 'electron';

export function createWindow() {
  return new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  })
}
