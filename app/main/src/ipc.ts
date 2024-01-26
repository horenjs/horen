import { dialog, type IpcMainInvokeEvent } from 'electron';
import fs from 'fs/promises';
import { db, logger, mainWindow } from './index';
import { walkDir, readMusicMeta, getExt, Track, strToBase64 } from './utils';
import { AUDIO_EXTS, APP_DATA_PATH, APP_NAME } from './constant';
import path from 'path';

////////////////////////////////////////////////////////////////////////////////

export const handleReadSetting = async (
  evt: IpcMainInvokeEvent,
  key: string
) => {
  await db.read();
  return db.data.setting[key];
};

////////////////////////////////////////////////////////////////////////////////

export const handleCloseMainwindow = async () => {
  mainWindow.destroy();
};

////////////////////////////////////////////////////////////////////////////////

export const handleOpenDialog = async () => {
  return await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'multiSelections'],
  });
};

////////////////////////////////////////////////////////////////////////////////

export const handleReadTrack = async (
  evt: IpcMainInvokeEvent,
  trackSource: string
) => {
  if (typeof trackSource === 'string') {
    return await readMusicMeta(trackSource);
  }
};

////////////////////////////////////////////////////////////////////////////////

export const handleReadTrackList = async () => {
  await db.read();
  return db.data.tracks;
};

////////////////////////////////////////////////////////////////////////////////

export async function handleRefreshTrackList(evt: IpcMainInvokeEvent) {
  logger.debug('to fresh track list');

  await db.read();
  const libs = db.data.libraries;
  const filePaths = [];

  for (const lib of libs) {
    logger.debug(`read files from ${lib}`);
    const files = await walkDir(lib);

    files.forEach((f) => {
      if (AUDIO_EXTS.includes(getExt(f))) {
        logger.debug('add track: ' + f);
        filePaths.push(f);
      } else {
        logger.debug('not support audio format: ' + f);
      }
    });
  }

  logger.debug('track file paths ' + filePaths);
  logger.debug('use new Set() to in-depulicate');
  const paths = new Set<string>(filePaths);

  const albumList = {};
  const trackList: Track[] = [];
  const artistList = {};

  const oldTracks = db.data.tracks || [];
  const oldArtists = db.data.artists || {};
  const oldAlbums = db.data.albums || {};

  const includes = (tracks: Track[], track: Partial<Track>) => {
    for (const t of tracks) {
      if (t.src === track.src) return t;
    }
    return false;
  };

  // tracks
  let i = 1;
  for (const p of paths) {
    const existed = includes(oldTracks, { src: p });
    if (existed) {
      logger.debug('existed in tracks: ' + p);
      trackList.push({ ...existed, index: i });
    } else {
      logger.debug('read meta: ' + p);
      const meta = await readMusicMeta(p);
      meta.cover = '';
      trackList.push({ ...meta, index: i });
    }
    i += 1;
  }

  // albums

  const albumIncludes = (albums: Record<string, number[]>, title: string) => {
    if (albums?.[title]) return true;
    else return false;
  };
  for (const track of trackList) {
    const albumName = track?.album || 'unknown';
    if (albumIncludes(oldAlbums, albumName)) {
      if (!albumList[albumName]) {
        albumList[albumName] = [];
      }
      albumList[albumName].push(track.index);
    } else {
      albumList[albumName] = [track.index];
    }
  }

  // artists

  const artistIncludes = (artists: Record<string, number[]>, name: string) => {
    if (artists?.[name]) return true;
    else return false;
  };
  for (const track of trackList) {
    const artistName = track?.artist || 'unknown';
    if (artistIncludes(oldArtists, artistName)) {
      if (!artistList[artistName]) {
        artistList[artistName] = [];
      }
      artistList[artistName].push(track.index);
    } else {
      artistList[artistName] = [track.index];
    }
  }

  logger.debug('write track list to lowdb');
  db.data.tracks = trackList;
  db.data.albums = albumList;
  db.data.artists = artistList;
  await db.write();
}

////////////////////////////////////////////////////////////////////////////////

export async function handleWriteLibraries(
  evt: IpcMainInvokeEvent,
  libs: string[]
) {
  if (libs instanceof Array) {
    console.log('write libs: ', libs);
    db.data.libraries = libs;
    await db.write();
  }
}

////////////////////////////////////////////////////////////////////////////////

export async function handleReadLibraries(evt: IpcMainInvokeEvent) {
  await db.read();
  return db.data.libraries;
}

////////////////////////////////////////////////////////////////////////////////

export const handleReadAudioSource = async (
  evt: IpcMainInvokeEvent,
  filename: string
) => {
  const base64 = await fs.readFile(filename, {
    encoding: 'base64',
  });
  return 'data:audio/wav;base64,' + base64;
};

////////////////////////////////////////////////////////////////////////////////

export const handleReadCoverSource = async (
  evt: IpcMainInvokeEvent,
  albumName: string
) => {
  const coverPath = path.join(
    APP_DATA_PATH,
    APP_NAME,
    'Cover',
    strToBase64(albumName) + '.png'
  );
  logger.debug('cover path: ' + coverPath);
  let cover: string;
  try {
    cover = await fs.readFile(coverPath, { encoding: 'base64' });
  } catch (err) {
    cover = '';
  }

  return 'data:image/png;base64,' + cover;
};

export const handleReadDBStore = async (
  evt: IpcMainInvokeEvent,
  key: string
) => {
  await db.read();
  return db.data[key];
};
