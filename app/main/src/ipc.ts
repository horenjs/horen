import { dialog, IpcMainInvokeEvent } from 'electron';
import path from 'path';

import { APP_DATA_PATH, APP_NAME, AUDIO_EXTS, CHANNELS } from './constant';
import { cacheDB, db, logger, mainWindow } from './index';
import {
  Album,
  Artist,
  fetchCoverAndSave,
  getExt,
  readMusicMeta,
  strToBase64,
  Track,
  walkDir,
} from './utils';

////////////////////////////////////////////////////////////////////////////////

export const handleCloseMainwindow = async () => {
  mainWindow.destroy();
};

export const handleMinimizeMainwindow = async () => {
  mainWindow.minimize();
};

export const handleMaximizeMainwindow = async () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
};

////////////////////////////////////////////////////////////////////////////////

export const handleOpenDialog = async () => {
  return await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'multiSelections'],
  });
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export async function handleRefreshTrackList(
  evt: IpcMainInvokeEvent,
  opts = {
    clearCache: false,
  }
) {
  logger.debug('to fresh track list');

  if (opts.clearCache) {
    logger.debug('clear cache: ' + opts.clearCache);
    cacheDB.data.tracks = [];
    await cacheDB.write();
  }

  await db.read();
  await cacheDB.read();

  const libs = db.data['setting.libraries'] as string[];

  const trackPathnames = await findAllAudios(libs);
  const trackList = await disposeTrackList(
    trackPathnames,
    opts.clearCache ? [] : cacheDB.data.tracks
  );
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
      CHANNELS.refresh.trackListMsg,
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
    const artist = track.albumArtist || track.artist;

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
    const cover = path.join(
      APP_DATA_PATH,
      APP_NAME,
      'Cover',
      strToBase64(key) + '.png'
    );
    artistList.push({ index: i, name: key, tracks, cover });
    i += 1;
  }

  return artistList;
};

////////////////////////////////////////////////////////////////////////////////
//////////////////////////// refresh track list ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
export const handleRefreshCover = async (
  evt: IpcMainInvokeEvent,
  {
    albumName = '',
    artistName = '',
    songName = '',
    type = 10,
  }: {
    albumName?: string;
    artistName?: string;
    songName?: string;
    type?: number;
  }
) => {
  await fetchCoverAndSave({ albumName, artistName, songName, type });
};

////////////////////////////////////////////////////////////////////////////////

export const handleDBRead = async (evt: IpcMainInvokeEvent, key: string) => {
  await db.read();
  const data = db.data[key];

  if (key === 'albums') {
    logger.debug('get albums from db');
    const albums = data as Album[];
    const tracks = db.data['tracks'] as Track[];
    for (const album of albums) {
      const trs = album.tracks.split(',');
      album.trackList = trs.map((trackIdx) => tracks[Number(trackIdx) - 1]);
    }
    return albums;
  }

  if (key === 'artists') {
    logger.debug('get artists from db');
    const artists = data as Artist[];
    const tracks = db.data['tracks'] as Track[];
    for (const artist of artists) {
      const trs = artist.tracks.split(',');
      artist.trackList = trs.map((trackIdx) => tracks[Number(trackIdx) - 1]);
    }
    return artists;
  }

  return data;
};

export const handleDBWrite = async (
  evt: IpcMainInvokeEvent,
  key: string,
  value: string | number | boolean | object
) => {
  db.data[key] = value;
  await db.write();
};
