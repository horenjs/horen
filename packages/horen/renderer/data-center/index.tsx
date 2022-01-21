/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:00:44
 * @LastEditTime : 2022-01-22 01:54:22
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\data-center\index.tsx
 * @Description  : 
 */
const electron = window.require('electron');
const { ipcRenderer } = electron;
import { Track } from 'types';
import { IPC_CODE } from '../../configs';

export class FileDC {
  public static async getList(path: string) {
    return await ipcRenderer.invoke(IPC_CODE.file.getList, path);
  }

  public static async get(p: string) :Promise<Track> {
    return await ipcRenderer.invoke(IPC_CODE.file.get, p);
  }
}

export class PlayerDC {
  public static async play(src: string) :Promise<number> {
    return await ipcRenderer.invoke(IPC_CODE.player.play, src);
  }

  public static async pause(id: number) {
    return await ipcRenderer.invoke(IPC_CODE.player.pause, id);
  }

  public static async resume(id: number) {
    return await ipcRenderer.invoke(IPC_CODE.player.resume, id);
  }

  public static async stop(id: number) {
    return await ipcRenderer.invoke(IPC_CODE.player.stop, id);
  }
}
