/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:34:25
 * @LastEditTime : 2022-01-26 10:34:37
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\app.ts
 * @Description  :
 */
import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

type Mode = 'development' | 'production' | undefined;

export class App {
  protected _mainWindow?: BrowserWindow;
  protected _url = 'http://localhost:8080';
  protected _path = './dist/main/index.js';
  protected _mode: Mode;

  public get mode() {
    return this._mode;
  }

  public set mode(m: Mode) {
    this._mode = m;
  }

  public get mainWindow() {
    return this._mainWindow;
  }

  public set url(url: string) {
    this._url = url;
  }

  public get url() {
    return this._url;
  }

  public set path(path: string) {
    this._path = path;
  }

  public get path() {
    return this._path;
  }

  start() {
    app.whenReady().then(() => {
      // create a new window
      this._mainWindow = createWindow();

      process.env.NODE_ENV === 'development'
        ? this._mainWindow.loadURL(this._url)
        : this._mainWindow.loadFile(this._path);

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

  protected get nodeEnv() {
    return process.env.NODE_ENV || '';
  }
}

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
    },
  });
}

const myapp = new App();

myapp.mode = (process.env.NODE_ENV || 'development') as Mode;
myapp.url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : './dist/main/index.js';

export default myapp;
