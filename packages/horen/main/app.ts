/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:34:25
 * @LastEditTime : 2022-01-21 15:05:02
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\app.ts
 * @Description  : 
 */
import { app, BrowserWindow } from 'electron';
import { createWindow } from './create';

export interface Opts {
  loadURL: string;
}

export class App {
  protected mainWindow: BrowserWindow | undefined;

  constructor(protected opts: Opts) {
    app.whenReady().then(() => {
      // create a new window
      this.mainWindow = createWindow();
      // only in macOS
      app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
      });
    });

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  start() {
    if (this.nodeEnv === 'development')
      this.mainWindow?.loadURL(this.opts.loadURL);
  }

  protected get nodeEnv() {
    return process.env.NODE_ENV || '';
  }
}
