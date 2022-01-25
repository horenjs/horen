/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:34:25
 * @LastEditTime : 2022-01-25 17:25:36
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\app.ts
 * @Description  :
 */
import { app, BrowserWindow } from 'electron';
import { createWindow } from './create';
import { dialog, ipcMain } from 'electron';
import { IPC_CODE } from '../configs';

export interface Opts {
  loadURL: string;
}

export class App {
  protected _mainWindow?: BrowserWindow;

  constructor(protected opts: Opts) {
    app.whenReady().then(() => {
      // create a new window
      this._mainWindow = createWindow();
      this.start();

      // 监听对话框打开
      ipcMain.handle(IPC_CODE.dialog.open, async (evt, flag = 'dir') => {
        if (this.mainWindow) {
          return await dialog.showOpenDialog(this.mainWindow, {
            properties: ['openDirectory', 'multiSelections'],
          });
        } else {
          console.log('there is no main window');
        }
      });

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

  public get mainWindow() {
    return this._mainWindow;
  }

  protected get nodeEnv() {
    return process.env.NODE_ENV || '';
  }
}
