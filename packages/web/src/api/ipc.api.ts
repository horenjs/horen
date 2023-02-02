export const sendMsg = window?.ipc?.sendMsg || null;
export const receiveMsg = window?.ipc?.receiveMsg || null;

declare global {
  interface Window {
    ipc: Ipc;
  }
}

interface Ipc {
  sendMsg?: (msg: string) => Promise<string>;
  receiveMsg?: () => Promise<string>;
}
