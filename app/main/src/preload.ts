import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from './constant';

export type IPC = {};

const IPC_API: IPC = {
  readSetting: async (key: string) => {
    return await ipcRenderer.invoke(CHANNELS.setting.read, key);
  },
  writeSetting: async (key: string, value: any) => {
    return await ipcRenderer.invoke(CHANNELS.setting.write, key, value);
  },
  closeMainwindow: async () => {
    return await ipcRenderer.invoke(CHANNELS.mainWindow.close);
  },
  openDialog: async () => {
    return await ipcRenderer.invoke(CHANNELS.openDialog);
  },
  refreshTrackListMsg: async (
    listener: (
      evt: Electron.IpcRendererEvent,
      current: number,
      total: number,
      msg: string
    ) => void
  ) => {
    ipcRenderer.on(CHANNELS.refresh.trackListMsg, listener);
  },
  refreshAlbumCover: async (albumName: string, artistName: string) => {
    return await ipcRenderer.invoke(
      CHANNELS.refresh.albumCover,
      albumName,
      artistName
    );
  },
  readDB: async (key: string) => {
    return await ipcRenderer.invoke(CHANNELS.db.read, key);
  },
  writeDB: async (key: string, value: any) => {
    return await ipcRenderer.invoke(CHANNELS.db.write, key, value);
  },
};

contextBridge.exposeInMainWorld('ipc', IPC_API);
