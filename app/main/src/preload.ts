import { contextBridge, ipcRenderer } from 'electron';
import { CHANNELS } from './constant';

export type IPC = {};

const IPC_API: IPC = {
  getFile: async (filename: string) => {
    return await ipcRenderer.invoke('get-a-file', filename);
  },
  walkDir: async (dirname: string) => {
    return await ipcRenderer.invoke('walk-dir', dirname);
  },
  openDialog: async () => {
    return await ipcRenderer.invoke('open-dialog');
  },
  setSetting: async (key: string, value: any) => {
    return await ipcRenderer.invoke(CHANNELS.setSetting, key, value);
  },
  getSetting: async (key: string) => {
    return await ipcRenderer.invoke(CHANNELS.getSetting, key);
  },
  closeMainWindow: async () => {
    return await ipcRenderer.invoke(CHANNELS.closeMainWindow);
  },
  getTrackList: async () => {
    return await ipcRenderer.invoke(CHANNELS.getTrackList);
  },
  getTrack: async (source: string) => {
    return await ipcRenderer.invoke(CHANNELS.getTrack, source);
  },
};

contextBridge.exposeInMainWorld('ipc', IPC_API);
