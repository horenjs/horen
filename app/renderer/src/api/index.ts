declare global {
  interface Window {
    ipc: {
      closeMainwindow: () => Promise<void>;
      minimizeMainwindow: () => Promise<void>;
      maximizeMainwindow: () => Promise<void>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      openDialog: () => Promise<any>;
      refreshTrackList: ({
        clearCache,
      }: {
        clearCache: boolean;
      }) => Promise<void>;
      refreshTrackListMsg: (
        listener: (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          evt: any,
          current: number,
          total: number,
          msg: string
        ) => void
      ) => void;
      fetchCoverFromInternet: ({
        albumName,
        artistName,
        songName,
        type,
      }: {
        albumName?: string;
        artistName?: string;
        songName?: string;
        type?: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) => Promise<any>;
      writeCoverToFile: (url: string, pathname: string) => Promise<string>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      readDB: <T = any>(key: string) => Promise<T>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      writeDB: (key: string, value: any) => Promise<void>;
    };
  }
}

export interface Track {
  uid: string;
  createAt?: string;
  updateAt?: string;
  modifiedAt?: string;
  src: string;
  source: string;
  title?: string;
  artist?: string;
  artists?: string;
  album?: string;
  //
  duration?: number;
  date?: string;
  genre?: string;
  cover?: string;
  howl?: Howl;
}

export const {
  closeMainwindow,
  maximizeMainwindow,
  minimizeMainwindow,
  openDialog,
  refreshTrackList,
  refreshTrackListMsg,
  fetchCoverFromInternet,
  writeCoverToFile,
  readDB,
  writeDB,
  // eslint-disable-next-line no-unsafe-optional-chaining
} = window?.ipc;
