import { Album } from '../pages/AlbumList';

declare global {
  interface Window {
    ipc: {
      readSetting: (key: string) => Promise<any>;
      writeSetting: (key: string, value: any) => Promise<void>;
      closeMainwindow: () => Promise<void>;
      openDialog: () => Promise<any>;
      readTrackList: () => Promise<Track[]>;
      refreshTrackList: () => Promise<void>;
      refreshTrackListMsg: (
        listener: (
          evt: any,
          current: number,
          total: number,
          msg: string
        ) => void
      ) => void;
      readLibraries: () => Promise<string[]>;
      writeLibraries: (libs: string[]) => Promise<void>;
      readAudioSource: (filepath: string) => Promise<string>;
      readCoverSource: (
        albumName: string,
        artistName?: string
      ) => Promise<string>;
      fetchCoverFromApi: (
        albumName: string,
        artistName?: string
      ) => Promise<void>;
      readPlaylist: () => Promise<Track[]>;
      writePlaylist: (playlist: Track[]) => Promise<void>;
      readAlbumList: () => Promise<Album[]>;
      writeAlbumList: (albumList: Album[]) => Promise<void>;
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
  readSetting,
  writeSetting,
  closeMainwindow,
  openDialog,
  readTrackList,
  refreshTrackList,
  refreshTrackListMsg,
  readLibraries,
  writeLibraries,
  readAudioSource,
  readCoverSource,
  fetchCoverFromApi,
  readPlaylist,
  writePlaylist,
  readAlbumList,
  writeAlbumList,
} = window?.ipc;
