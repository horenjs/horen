declare global {
  interface Window {
    ipc: {
      readSetting: (key: string) => Promise<any>;
      writeSetting: (key: string, value: any) => Promise<void>;
      closeMainwindow: () => Promise<void>;
      openDialog: () => Promise<any>;
      readTrackList: () => Promise<Track[]>;
      refreshTrackList: () => Promise<void>;
      readLibraries: () => Promise<string[]>;
      writeLibraries: (libs: string[]) => Promise<void>;
      readAudioSource: (filepath: string) => Promise<string>;
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

export const {
  readSetting,
  writeSetting,
  closeMainwindow,
  openDialog,
  readTrackList,
  refreshTrackList,
  readLibraries,
  writeLibraries,
  readAudioSource,
} = window?.ipc;
