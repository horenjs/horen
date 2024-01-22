declare global {
  interface Window {
    ipc: {
      getFile: (filename: string) => Promise<string>;
      walkDir: (dirname: string) => Promise<string[]>;
      openDialog: () => Promise<any>;
      setSetting: (key: string, value: any) => Promise<void>;
      closeMainWindow: () => Promise<void>;
    };
  }
}

export const getFile = window?.ipc?.getFile;
export const walkDir = window?.ipc?.walkDir;
export const openDialog = window?.ipc?.openDialog;
export const setSetting = window?.ipc?.setSetting;
export const closeMainWindow = window?.ipc?.closeMainWindow;
