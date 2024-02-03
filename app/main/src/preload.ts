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
  minimizeMainwindow: async () => {
    return await ipcRenderer.invoke(CHANNELS.mainWindow.minimize);
  },
  maximizeMainwindow: async () => {
    return await ipcRenderer.invoke(CHANNELS.mainWindow.maximize);
  },
  openDialog: async () => {
    return await ipcRenderer.invoke(CHANNELS.openDialog);
  },
  refreshTrackList: async ({ clearCache }) =>
    await ipcRenderer.invoke(CHANNELS.refresh.trackList, { clearCache }),
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
  refreshCover: async ({
    albumName,
    artistName,
    songName,
    type,
  }: {
    albumName?: string;
    artistName?: string;
    songName?: string;
    type?: number;
  }) => {
    return await ipcRenderer.invoke(CHANNELS.refresh.albumCover, {
      albumName,
      artistName,
      songName,
      type,
    });
  },
  readDB: async (key: string) => {
    return await ipcRenderer.invoke(CHANNELS.db.read, key);
  },
  writeDB: async (key: string, value: any) => {
    return await ipcRenderer.invoke(CHANNELS.db.write, key, value);
  },
};

contextBridge.exposeInMainWorld('ipc', IPC_API);
