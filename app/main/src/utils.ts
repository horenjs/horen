import fs from 'fs/promises';
import { JSONFilePreset } from 'lowdb/node';
import mm from 'music-metadata';
import path from 'path';
import winston from 'winston';
import fse from 'fs-extra';
import defaultCover from './static/defaultCover';
import { logger } from './index';
import { fetchAlbumCover } from './apis';

import { APP_DATA_PATH, APP_NAME } from './constant';

import type { IAudioMetadata } from 'music-metadata';
import axios from 'axios';

export interface Track {
  index?: number;
  uid: string;
  createAt?: string;
  updateAt?: string;
  modifiedAt?: string;
  src?: string;
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
export type Album = {
  index: number;
  title: string;
  artist: string;
  tracks: string;
};

export type Artist = {
  index: number;
  name: string;
  tracks: string;
};

/**
 * 解析音频文件元数据
 * @param trackSrc 音频文件地址
 * @returns 解析后的音频对象
 */
export async function readMusicMeta(trackSrc: string): Promise<Track> {
  const buffer = await fs.readFile(trackSrc);
  const stats = await fs.stat(trackSrc);
  let meta: IAudioMetadata;

  meta = await mm.parseBuffer(buffer);
  if (!meta) return;

  let cover: string;

  const albumName = meta.common?.album || 'unknown';
  const artistName = meta.common?.artist || 'unknown';

  const coverPath = path.join(APP_DATA_PATH, APP_NAME, 'Cover');
  await fse.ensureDir(coverPath);
  const albumPath = path.join(
    coverPath,
    strToBase64(albumName + artistName) + '.png'
  );

  if (await fse.exists(albumPath)) {
    logger.debug('read cover from file: ' + albumPath);
    cover = await fs.readFile(albumPath, { encoding: 'base64url' });
  } else {
    logger.debug('no cover file, read from music meta');
    const data = meta.common?.picture ? meta.common.picture[0].data : null;
    if (data) {
      logger.debug('read cover from music meta');
      await fs.writeFile(albumPath, data);
      cover = arrayBufferToBase64(data);
    } else {
      logger.debug('cannot read cover from meta');
    }
  }

  return {
    uid: strToBase64(trackSrc),
    createAt: stats.birthtime.toJSON(),
    updateAt: stats.ctime.toJSON(),
    modifiedAt: stats.mtime.toJSON(),
    //
    src: trackSrc,
    title: String(meta?.common?.title),
    artist: String(meta?.common?.artist),
    artists: String(meta?.common?.artists),
    album: String(meta?.common?.album),
    //
    duration: meta?.format?.duration,
    date: String(meta?.common?.date),
    genre: String(meta?.common?.genre),
    cover: 'data:image/png;base64,' + cover,
    //
  };
}

export function arrayBufferToBase64(u8Arr: Buffer | null) {
  if (!u8Arr) return '';
  let chunk = 0x8000;
  let index = 0;
  let length = u8Arr.length;
  let result = '';
  let slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + chunk, length));
    result += String.fromCharCode.apply(null, slice);
    index += chunk;
  }
  return btoa(result);
}

export const strToBase64 = (str: string) => {
  const buf = Buffer.from(str, 'utf-8');
  return buf.toString('base64url');
};

export const base64toStr = (base64str: string) => {
  const buf = Buffer.from(base64str, 'base64url');
  return buf.toString('utf-8');
};

export const walkDir = async (dirname: string, storeList: string[] = []) => {
  const files = await fs.readdir(dirname);

  for (const file of files) {
    const fullpath = path.join(dirname, file);
    const stats = await fs.stat(fullpath);
    if (stats.isFile()) storeList.push(fullpath);
    if (stats.isDirectory()) {
      await walkDir(fullpath, storeList);
    }
  }

  return storeList;
};

export const getExt = (filename: string) => {
  return filename.split('.').pop();
};

export const initLogger = () => {
  const logFilePath = path.join(APP_DATA_PATH, APP_NAME, 'logs', 'horen.log');
  return winston.createLogger({
    transports: [
      new winston.transports.Console({ level: 'debug' }),
      new winston.transports.File({ level: 'debug', filename: logFilePath }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `${info.timestamp} [${info.level}] - ${info.message}`;
      })
    ),
  });
};

export type DBDataType = {
  setting: {
    language?: string;
  };
  libraries?: string[];
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
};

export const initDatabase = async () => {
  const db = await JSONFilePreset<DBDataType>(
    path.join(APP_DATA_PATH, APP_NAME, 'db.json'),
    {
      setting: {},
      tracks: [],
      libraries: [],
      albums: [],
      artists: [],
    }
  );
  await db.write();
  return db;
};

export const initCacheDB = async () => {
  const db = await JSONFilePreset<{ tracks: Track[] }>(
    path.join(APP_DATA_PATH, APP_NAME, 'cache.json'),
    { tracks: [] }
  );
  await db.write();
  return db;
};

export const fetchCoverAndSave = async (
  albumName: string,
  artistName: string
) => {
  const coverPath = path.join(
    APP_DATA_PATH,
    APP_NAME,
    'Cover',
    strToBase64(albumName + artistName) + '.png'
  );

  const url = await fetchAlbumCover(albumName, artistName);
  if (typeof url === 'string') {
    const resp = await axios.get(url, { responseType: 'arraybuffer' });
    const data = resp?.data;
    if (data) {
      logger.debug('fetch cover from api success');
      await fse.writeFile(coverPath, data);
      return arrayBufferToBase64(data);
    }
  } else {
    logger.debug('cannot save cover from url.');
  }
};
