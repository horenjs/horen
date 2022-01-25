/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:00:44
 * @LastEditTime : 2022-01-25 17:18:40
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\data-center\index.tsx
 * @Description  : 
 */
const electron = window.require('electron');
const { ipcRenderer } = electron;
import { Track, SettingFile } from 'types';
import { IPC_CODE } from '../../configs';

export class FileDC {
  public static async getList(path: string) {
    return await ipcRenderer.invoke(IPC_CODE.file.getList, path);
  }

  public static async get(p: string) :Promise<Track> {
    return await ipcRenderer.invoke(IPC_CODE.file.get, p);
  }
}

export class SettingDC {
  public static async get() {
    return await ipcRenderer.invoke(IPC_CODE.setting.get);
  }

  public static async set(setting: SettingFile) {
    return await ipcRenderer.invoke(IPC_CODE.setting.set, setting);
  }
}

export class DialogDC {
  public static async open(flag?: string) {
    return await ipcRenderer.invoke(IPC_CODE.dialog.open, flag);
  }
}