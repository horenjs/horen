import { contextBridge } from 'electron';

export type IPC = {};

const IPC_API: IPC = {};

contextBridge.exposeInMainWorld('ipc', IPC_API);
