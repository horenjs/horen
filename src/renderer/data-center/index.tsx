/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:00:44
 * @LastEditTime : 2022-02-01 16:30:20
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\data-center\index.tsx
 * @Description  :
 */
const electron = window.require('electron');
const { ipcRenderer } = electron;
import {Track, SettingFile, LyricScript, PlayList} from 'types';
import { IPC_CODE } from 'constant';

export class TrackDC {
  public static async getListCached(): Promise<Track[]> {
    return await ipcRenderer.invoke(IPC_CODE.track.getListCached);
  }

  public static async rebuildCache(paths: string[]): Promise<Track[]> {
    return await ipcRenderer.invoke(IPC_CODE.track.rebuildCache, paths);
  }

  public static async getBySrc(src: string): Promise<Track> {
    return await ipcRenderer.invoke(IPC_CODE.track.getBySrc, src);
  }

  public static async getMsg(): Promise<string> {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(IPC_CODE.track.msg, (evt: any, msg: string) => {
        resolve(msg);
      });
    });
  }

  public static async lyric(src: string): Promise<LyricScript[]> {
    return await ipcRenderer.invoke(IPC_CODE.track.lyric, src);
  }
}

export class SettingDC {
  public static async get() {
    return await ipcRenderer.invoke(IPC_CODE.setting.get);
  }

  public static async set(setting: SettingFile): Promise<boolean> {
    return await ipcRenderer.invoke(IPC_CODE.setting.set, setting);
  }
}

export class PlayListDC {
  public static async getList() {
    return await ipcRenderer.invoke(IPC_CODE.playlist.getList);
  }

  public static async get(title: string) :Promise<PlayList> {
    return await ipcRenderer.invoke(IPC_CODE.playlist.get, title);
  }

  public static async set(pyl: PlayList) {
    return await ipcRenderer.invoke(IPC_CODE.playlist.set, pyl);
  }
}

export class DialogDC {
  public static async open(flag?: string) {
    return await ipcRenderer.invoke(IPC_CODE.dialog.open, flag);
  }
}

export class MainwindowDC {
  public static async close() {
    return await ipcRenderer.invoke(IPC_CODE.mainwindow.close);
  }

  public static async minimize() {
    return await ipcRenderer.invoke(IPC_CODE.mainwindow.minimize);
  }
}
