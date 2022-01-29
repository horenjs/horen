/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:00:44
 * @LastEditTime : 2022-01-29 20:07:18
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\data-center\index.tsx
 * @Description  :
 */
const electron = window.require('electron');
const { ipcRenderer } = electron;
import { Track, SettingFile } from 'types';
import { IPC_CODE } from '../../constant';

export class TrackDC {
  public static async getListCached() :Promise<Track[]> {
    return await ipcRenderer.invoke(IPC_CODE.track.getListCached);
  }

  public static async rebuildCache(paths: string[]): Promise<Track[]> {
    return await ipcRenderer.invoke(IPC_CODE.track.rebuildCache, paths);
  }

  public static async getByUUID(uuid: string): Promise<Track> {
    return await ipcRenderer.invoke(IPC_CODE.track.getByUUID, uuid);
  }

  public static async getMsg(): Promise<string> {
    return new Promise((resolve, reject) => {
      ipcRenderer.on(IPC_CODE.track.msg, (evt, msg) => {
        resolve(msg);
      });
    });
  }
}

export class SettingDC {
  public static async get() {
    return await ipcRenderer.invoke(IPC_CODE.setting.get);
  }

  public static async set(setting: SettingFile) :Promise<boolean> {
    return await ipcRenderer.invoke(IPC_CODE.setting.set, setting);
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
