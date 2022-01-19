/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-10 12:45:39
 * @LastEditTime : 2022-01-19 22:53:27
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \mintin-alo\src\main\index.ts
 * @Description  : Electron 主入口文件
 */
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import mm from "music-metadata";
import { IPC_CODE } from "../configs";
import { readDirAsync, arrayBufferToBase64 } from "../../utils";
import { ISong } from "../types";
import Player from './player';

let mainWindow: BrowserWindow;
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const w = new BrowserWindow({
    // width: 602,
    // height: 302,
    // frame: false,
    resizable: true,
    // movable: true,
    // transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,        // this config make react use electron.
      webSecurity: false,
    }
  })

  isDev
    ? w.loadURL("http://localhost:8080/")
    : w.loadURL("http://localhost:8080/"/*path.resolve('dist/renderer/index.html')*/);

  return w;
}

app.whenReady().then(() => {
  // create main window
  mainWindow = createWindow();

  // only in macOS
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on("window-all-closed", function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

ipcMain.handle(IPC_CODE.file.getList, async (evt, p) => {
  const supportFormats = [
    'aiff',
    'aac',
    'ape',
    'asf',
    'dsdiff',
    'dsf',
    'flac',
    'mp2',
    'mka',
    'mkv',
    'mp3',
    'mpc',
    'mp4', 'm4a', 'm4v',
    'ogg',
    'opus',
    'speex',
    'theora',
    'vorbis',
    'wav',
    'webm',
    'wv',
    'wma',
  ];

  const files = await readDirAsync(p);
  return files.filter(f => {
    const songPath = path.resolve(f);
    const ext = path.extname(songPath).replace('\.', '');
    return supportFormats.includes(ext);
  })
})

ipcMain.handle(IPC_CODE.file.get, async (evt, p) => {
  const meta = await mm.parseFile(path.resolve(p));
  const { picture } = meta.common;
  const arrybuffer = picture && picture[0].data;

  return {
    ...meta.common,
    picture: picture ? arrayBufferToBase64(arrybuffer) : '',
  } as ISong;
})

let playList: {
  id: number,
  src: string,
  player: Player,
}[] = [];

ipcMain.handle(IPC_CODE.player.play, async (evt, src) => {
  const player = new Player(src);
  playList.push({id: playList.length, src: src, player: player});
  player.play();
  return playList.length - 1;
})

ipcMain.handle(IPC_CODE.player.pause, async (evt, id) => {
  playList[id]?.player.pause();
});

ipcMain.handle(IPC_CODE.player.resume, async (evt, id) => {
  playList[id]?.player.resume();
});

ipcMain.handle(IPC_CODE.player.stop, async (evt, id) => {
  playList[id]?.player.stop();
});
