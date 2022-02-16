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
import {Track, SettingFile, LyricScript, PlayList, Album, Resp, Rectangle} from 'types';
import { IPC_CODE } from 'constant';

export class TrackDC {
  public static async getListCached(): Promise<Resp<Track[]>> {
    return await ipcRenderer.invoke(IPC_CODE.track.getTrackList);
  }

  public static async getAlbumList(limit = 20, offset = 0): Promise<Resp<Album[]>> {
    return await ipcRenderer.invoke(IPC_CODE.track.getAlbumList, limit, offset);
  }

  public static async getBySrc(src: string): Promise<Resp<Track>> {
    return await ipcRenderer.invoke(IPC_CODE.track.getBySrc, src);
  }

  public static async getAlbumByKey(key: string): Promise<Resp<Album>> {
    return await ipcRenderer.invoke(IPC_CODE.track.getAlbumByKey, key);
  }

  public static async getAlbumCover(key: string): Promise<Resp<string>> {
    return await ipcRenderer.invoke(IPC_CODE.track.getAlbumCover, key);
  }

  public static async rebuildCache(paths: string[]): Promise<Resp<undefined>> {
    return await ipcRenderer.invoke(IPC_CODE.track.rebuildCache, paths);
  }

  public static async getMsg(): Promise<string> {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(IPC_CODE.track.msg, (evt: any, msg: string) => {
        resolve(msg);
      });
    });
  }

  public static async lyric(src: string): Promise<Resp<LyricScript[]>> {
    return await ipcRenderer.invoke(IPC_CODE.track.lyric, src);
  }
}

export class SettingDC {
  public static async get() :Promise<SettingFile> {
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

  public static async setBounds(bounds: Rectangle) {
    return await ipcRenderer.invoke(IPC_CODE.mainwindow.setBounds, bounds);
  }

  public static async getBounds() :Promise<Resp<Rectangle>> {
    return await ipcRenderer.invoke(IPC_CODE.mainwindow.getBounds);
  }
}
