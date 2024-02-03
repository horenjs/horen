import { Album } from '../pages/AlbumList';

declare global {
  interface Window {
    ipc: {
      closeMainwindow: () => Promise<void>;
      minimizeMainwindow: () => Promise<void>;
      maximizeMainwindow: () => Promise<void>;
      openDialog: () => Promise<any>;
      refreshTrackList: ({
        clearCache,
      }: {
        clearCache: boolean;
      }) => Promise<void>;
      refreshTrackListMsg: (
        listener: (
          evt: any,
          current: number,
          total: number,
          msg: string
        ) => void
      ) => void;
      refreshCover: ({
        albumName,
        artistName,
        songName,
        type,
      }: {
        albumName?: string;
        artistName?: string;
        songName?: string;
        type?: number;
      }) => Promise<void>;
      readDB: <T = any>(key: string) => Promise<T>;
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
  refreshCover,
  readDB,
  writeDB,
} = window?.ipc;
