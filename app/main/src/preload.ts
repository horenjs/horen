import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from './constant';

const IPC_API = {
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
  fetchCoverFromInternet: async ({
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
    return await ipcRenderer.invoke(CHANNELS.cover.fetchFromInternet, {
      albumName,
      artistName,
      songName,
      type,
    });
  },
  writeCoverToFile: async (url: string, pathname: string) => {
    return await ipcRenderer.invoke(CHANNELS.cover.writeToFile, url, pathname);
  },
  getLyric: async (songName: string) => {
    return await ipcRenderer.invoke(CHANNELS.lyric.get, songName);
  },
  readDB: async (key: string) => {
    return await ipcRenderer.invoke(CHANNELS.db.read, key);
  },
  writeDB: async (key: string, value: string | number | boolean | object) => {
    return await ipcRenderer.invoke(CHANNELS.db.write, key, value);
  },
};

contextBridge.exposeInMainWorld('ipc', IPC_API);
