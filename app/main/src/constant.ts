export const PORT = 19527;

export const APP_DATA_PATH = process.env.APPDATA;

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
  track: {
    read: 'track-read',
  },
  trackList: {
    refresh: 'track-list-refresh',
    read: 'track-list-read',
    write: 'track-list-write',
    refreshMsg: 'track-list-refresh-msg',
  },
  libraries: {
    write: 'libraries-write',
    read: 'libraries-read',
  },
  playlist: {
    write: 'playlist-write',
    read: 'playlist-read',
  },
  albumList: {
    write: 'albumList-write',
    read: 'albumList-read',
  },
  readAudioSource: 'read-audio-source',
  readCoverSource: 'read-cover-source',
  fetchCoverFromApi: 'fetch-cover-from-api',
  readLyricSource: 'read-lyric-source',
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
