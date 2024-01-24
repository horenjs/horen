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
  readLibraries: async () => {
    return await ipcRenderer.invoke(CHANNELS.libraries.read);
  },
  writeLibraries: async (libs: string[]) => {
    return await ipcRenderer.invoke(CHANNELS.libraries.write, libs);
  },
  readAudioSource: async (filepath: string) => {
    return await ipcRenderer.invoke(CHANNELS.readAudioSource, filepath);
  },
  readCoverSource: async (filepath: string) => {
    return await ipcRenderer.invoke(CHANNELS.readCoverSource, filepath);
  },
};

contextBridge.exposeInMainWorld('ipc', IPC_API);
