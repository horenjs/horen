/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:00:44
 * @LastEditTime : 2022-01-23 21:10:33
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\data-center\index.tsx
 * @Description  : 
 */
const electron = window.require('electron');
const { ipcRenderer } = electron;
import { Track, Setting } from 'types';
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

  public static async set(setting: Setting) {
    return await ipcRenderer.invoke(IPC_CODE.setting.set, setting);
  }
}