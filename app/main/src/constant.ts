import { app } from 'electron';

export const PORT = 19527;

export const APP_DATA_PATH = process.env.APPDATA || app?.getPath('appData');

export const APP_NAME = 'horen';

export const CHANNELS = {
  setting: {
    read: 'setting-read',
    write: 'setting-write',
  },
  mainWindow: {
    close: 'mainwindow-close',
    minimize: 'mainwindow-minimize',
    maximize: 'mainwindow-maximize',
  },
  openDialog: 'open-dialog',
  refresh: {
    trackList: 'refresh-track-list',
    trackListMsg: 'refresh-track-list-msg',
  },
  cover: {
    fetchFromInternet: 'fetch-cover-from-internet',
    writeToFile: 'write-cover-to-file',
  },
  lyric: {
    get: 'get-lyric',
  },
  db: {
    read: 'db-read',
    write: 'db-write',
  },
};

export const AUDIO_EXTS = [
  'aiff',
  'aac',
  'ape',
  'asf',
  'dsdiff',
  'dsf',
  'flac',
  'mp2',
  'mka',
  'mkv',
  'mp3',
  'mpc',
  'mp4',
  'm4a',
  'm4v',
  'ogg',
  'opus',
  'speex',
  'theora',
  'vorbis',
  'wav',
  'webm',
  'wv',
  'wma',
];
