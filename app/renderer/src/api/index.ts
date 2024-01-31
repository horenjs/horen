import { Album } from '../pages/AlbumList';

declare global {
  interface Window {
    ipc: {
      closeMainwindow: () => Promise<void>;
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
      refreshAlbumCover: (
        albumName: string,
        artistName?: string
      ) => Promise<void>;
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
}

export const {
  closeMainwindow,
  openDialog,
  refreshTrackList,
  refreshTrackListMsg,
  refreshAlbumCover,
  readDB,
  writeDB,
} = window?.ipc;
