import { dialog, type IpcMainInvokeEvent } from 'electron';
import fs from 'fs/promises';
import { cacheDB, db, logger, mainWindow } from './index';
import {
  walkDir,
  readMusicMeta,
  getExt,
  Track,
  strToBase64,
  Album,
  Artist,
  fetchCoverAndSave,
} from './utils';
import { AUDIO_EXTS, APP_DATA_PATH, APP_NAME, CHANNELS } from './constant';
import path from 'path';
import defaultCover from './static/defaultCover';
import fse from 'fs-extra';

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
) => {};

////////////////////////////////////////////////////////////////////////////////

export const handleReadTrackList = async (
  evt: IpcMainInvokeEvent,
  offset = 0,
  limit = 20
) => {
  await db.read();
  return db.data.tracks.slice(offset, limit);
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export async function handleRefreshTrackList(evt: IpcMainInvokeEvent) {
  logger.debug('to fresh track list');

  await db.read();
  await cacheDB.read();

  const libs = db.data['setting.libraries'];
  const trackPathnames = await findAllAudios(libs);
  const trackList = await disposeTrackList(trackPathnames, cacheDB.data.tracks);
  const albumList = await disposeAlbumList(trackList);
  const artistList = await disposeArtistList(trackList);

  logger.debug('write track list to lowdb');
  db.data.tracks = trackList;
  logger.debug('write album list to lowdb');
  db.data.albums = albumList;
  logger.debug('write artist list to lowdb');
  db.data.artists = artistList;
  await db.write();
}

const findAllAudios = async (libraries: string[]) => {
  const trackPathnames = [];
  for (const lib of libraries) {
    logger.debug(`read files from ${lib}`);
    const files = await walkDir(lib);

    files.forEach((f) => {
      if (AUDIO_EXTS.includes(getExt(f))) {
        logger.debug('add track: ' + f);
        trackPathnames.push(f);
      } else {
        logger.debug('not support audio format: ' + f);
      }
    });
  }
  logger.debug('use new Set() to in-depulicate');
  const paths = Array.from(new Set<string>(trackPathnames));
  logger.debug('track list length: ' + paths.length);
  return paths;
};

const disposeTrackList = async (
  trackPathnames: string[],
  cacheTracks: Track[]
) => {
  const includes = (tracks: Track[], track: Partial<Track>) => {
    for (const t of tracks) {
      if (t.src === track.src) return t;
    }
    return false;
  };

  const trackList: Track[] = [];
  // tracks
  let i = 1;
  for (const p of trackPathnames) {
    const existed = includes(cacheTracks, { src: p });
    mainWindow.webContents.send(
      CHANNELS.trackList.refreshMsg,
      i,
      trackPathnames.length,
      p
    );
    if (existed) {
      logger.debug('existed in tracks: ' + p);
      trackList.push({ ...existed, index: i });
    } else {
      logger.debug('read meta: ' + p);
      try {
        const meta = await readMusicMeta(p);
        meta.cover = '';
        trackList.push({ ...meta, index: i });

        cacheDB.update(({ tracks }) => {
          tracks.push({ ...meta, index: cacheTracks.length + i });
        });
      } catch (err) {
        logger.debug('read meta err: ' + err);
      }
    }
    i += 1;
  }
  return trackList;
};

// albums
const disposeAlbumList = async (trackList: Track[]) => {
  const platAlbums = new Map<
    string,
    { artist: Set<string>; tracks: Set<number> }
  >();

  for (const track of trackList) {
    const index = track.index;
    const album = track.album;
    const artist = track.artist;

    if (!platAlbums[album]) {
      logger.debug('create album: ' + album);
      platAlbums[album] = {
        artist: new Set([artist]),
        tracks: new Set([index]),
      };
    } else {
      platAlbums[album]['tracks'].add(index);
      platAlbums[album]['artist'].add(artist);
    }
  }

  const albumList: Album[] = [];
  let i = 1;
  for (const key in platAlbums) {
    const tracks = Array.from(platAlbums[key]['tracks']).join(',');
    const title = key;
    const artist = Array.from(platAlbums[key]['artist']).join(',');
    const cover = path.join(
      APP_DATA_PATH,
      APP_NAME,
      'Cover',
      strToBase64(title + artist) + '.png'
    );
    albumList.push({ index: i, title, artist, tracks, cover });
    i += 1;
  }

  return albumList;
};

// artists
const disposeArtistList = async (trackList: Track[]) => {
  const artists = new Map<string, Set<number>>();

  for (const track of trackList) {
    const index = track.index;
    const artist = track.artist;

    if (!artists[artist]) {
      logger.debug('create artist: ' + artist);
      artists[artist] = new Set([index]);
    } else {
      artists[artist].add(index);
    }
  }

  const artistList: Artist[] = [];
  let i = 1;
  for (const key in artists) {
    const tracks = Array.from(artists[key]).join(',');
    artistList.push({ index: i, name: key, tracks });
    i += 1;
  }

  return artistList;
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export async function handleWriteLibraries(
  evt: IpcMainInvokeEvent,
  libs: string[]
) {
  if (libs instanceof Array) {
    console.log('write libs: ', libs);
    db.data['setting.libraries'] = libs;
    await db.write();
  }
}

////////////////////////////////////////////////////////////////////////////////

export async function handleReadLibraries(evt: IpcMainInvokeEvent) {
  await db.read();
  return db.data['setting.libraries'];
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
  albumName: string,
  artistName: string
) => {
  const coverPath = path.join(
    APP_DATA_PATH,
    APP_NAME,
    'Cover',
    strToBase64(albumName + artistName) + '.png'
  );
  let cover = defaultCover;
  if (await fse.exists(coverPath)) {
    cover = await fs.readFile(coverPath, { encoding: 'base64' });
    logger.debug('read from cover file success: ' + coverPath);
  } else {
    logger.debug('there is no local cover, using default');
  }
  return 'data:image/png;base64,' + cover;
};

////////////////////////////////////////////////////////////////////////////////

export const handleReadLyricSource = async () => {};

////////////////////////////////////////////////////////////////////////////////

export const handleReadDBStore = async (
  evt: IpcMainInvokeEvent,
  key: string
) => {
  await db.read();
  return db.data[key];
};

////////////////////////////////////////////////////////////////////////////////

export const handleFetchCoverFromApi = async (
  evt: IpcMainInvokeEvent,
  albumName: string,
  artist: string
) => {
  await fetchCoverAndSave(albumName, artist);
};

////////////////////////////////////////////////////////////////////////////////

export const handleReadPlaylist = async () => {
  await db.read();
  return db.data.playlist;
};

////////////////////////////////////////////////////////////////////////////////

export const handleWritePlaylist = async (
  evt: IpcMainInvokeEvent,
  playlist: Track[]
) => {
  db.data.playlist = playlist;
  await db.write();
};

////////////////////////////////////////////////////////////////////////////////

export const handleReadAlbumList = async () => {
  await db.read();
  return db.data.albums;
};

////////////////////////////////////////////////////////////////////////////////

export const handleWriteAlbumList = async (
  evt: IpcMainInvokeEvent,
  albumList: Album[]
) => {
  db.data.albums = albumList;
  await db.write();
};

////////////////////////////////////////////////////////////////////////////////

export const handleDBRead = async (evt: IpcMainInvokeEvent, key: string) => {
  await db.read();
  return db.data[key];
};

export const handleDBWrite = async (
  evt: IpcMainInvokeEvent,
  key: string,
  value: any
) => {
  db.data[key] = value;
  await db.write();
};
