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
  closeMainWindow: async () => {
    return await ipcRenderer.invoke(CHANNELS.closeMainWindow);
  },
};

contextBridge.exposeInMainWorld('ipc', IPC_API);
