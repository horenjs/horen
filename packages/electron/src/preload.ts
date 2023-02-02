import { contextBridge, ipcRenderer } from 'electron';
import channels from './channels';

export type IPC = {
  sendMsg(msg: string): Promise<string>;
  receiveMsg(): Promise<string>;
}

declare global {
  interface Window {
    ipc: IPC;
  }
}

const IPC_API: IPC = {
  sendMsg,
  receiveMsg
}

contextBridge.exposeInMainWorld("ipc", IPC_API);

// ipc handles
async function sendMsg(msg: string) {
  return await ipcRenderer.invoke(channels.SEND_MSG, msg);
}

async function receiveMsg():Promise<string> {
  return new Promise((res, rej) => {
    ipcRenderer.on(channels.REPLY_MSG, (evt, msg: string) => {
      res(msg);
    })
  })
}