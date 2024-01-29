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
  readTrackList: async () => {
    return await ipcRenderer.invoke(CHANNELS.trackList.read);
  },
  refreshTrackList: async () => {
    return await ipcRenderer.invoke(CHANNELS.trackList.refresh);
  },
  refreshTrackListMsg: async (
    listener: (
      evt: Electron.IpcRendererEvent,
      current: number,
      total: number,
      msg: string
    ) => void
  ) => {
    ipcRenderer.on(CHANNELS.trackList.refreshMsg, listener);
  },
  readLibraries: async () => {
    return await ipcRenderer.invoke(CHANNELS.libraries.read);
  },
  writeLibraries: async (libs: string[]) => {
    return await ipcRenderer.invoke(CHANNELS.libraries.write, libs);
  },
  readAudioSource: async (filepath: string) => {
    return await ipcRenderer.invoke(CHANNELS.readAudioSource, filepath);
  },
  readCoverSource: async (albumName: string, artistName: string) => {
    return await ipcRenderer.invoke(
      CHANNELS.readCoverSource,
      albumName,
      artistName
    );
  },
  fetchCoverFromApi: async (albumName: string, artistName: string) => {
    return await ipcRenderer.invoke(
      CHANNELS.fetchCoverFromApi,
      albumName,
      artistName
    );
  },
  readPlaylist: async () => {
    return await ipcRenderer.invoke(CHANNELS.playlist.read);
  },
  writePlaylist: async (playlist: any[]) => {
    return await ipcRenderer.invoke(CHANNELS.playlist.write, playlist);
  },
  readAlbumList: async () => {
    return await ipcRenderer.invoke(CHANNELS.albumList.read);
  },
  writeAlbumList: async (albumList: any[]) => {
    return await ipcRenderer.invoke(CHANNELS.albumList.write, albumList);
  },
  readDB: async (key: string) => {
    return await ipcRenderer.invoke(CHANNELS.db.read, key);
  },
  writeDB: async (key: string, value: any) => {
    return await ipcRenderer.invoke(CHANNELS.db.write, key, value);
  },
};

contextBridge.exposeInMainWorld('ipc', IPC_API);
