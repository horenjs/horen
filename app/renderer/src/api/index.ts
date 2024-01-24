declare global {
  interface Window {
    ipc: {
      getFile: (filename: string) => Promise<string>;
      walkDir: (dirname: string) => Promise<string[]>;
      openDialog: () => Promise<any>;
      setSetting: (key: string, value: any) => Promise<void>;
      getSetting: (key: string) => Promise<any>;
      closeMainWindow: () => Promise<void>;
      getTrackList: () => Promise<string[]>;
      getTrack: (source: string) => Promise<Track>;
      writeLibraries: (libs: string[]) => Promise<void>;
      refreshTrackList: () => Promise<void>;
    };
  }
}

export interface Track {
  uid: string;
  createAt?: string;
  updateAt?: string;
  modifiedAt?: string;
  src: string;
  title?: string;
  artist?: string;
  artists?: string;
  album?: string;
  //
  duration?: number;
  date?: string;
  genre?: string;
  cover?: string;
}

export const getFile = window?.ipc?.getFile;
export const walkDir = window?.ipc?.walkDir;
export const openDialog = window?.ipc?.openDialog;
export const setSetting = window?.ipc?.setSetting;
export const getSetting = window?.ipc?.getSetting;
export const closeMainWindow = window?.ipc?.closeMainWindow;
export const getTrackList = window?.ipc?.getTrackList;
export const getTrack = window?.ipc?.getTrack;
export const writeLibraries = window?.ipc?.writeLibraries;
export const refreshTrackList = window?.ipc?.refreshTrackList;
