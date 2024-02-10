import fs from 'fs/promises';
import { JSONFilePreset } from 'lowdb/node';
import mm from 'music-metadata';
import path from 'path';
import winston from 'winston';
import fse from 'fs-extra';
import { logger } from './index';
import { fetchCover } from './apis';

import { APP_DATA_PATH, APP_NAME } from './constant';

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
  albumArtist?: string;
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
  cover: string;
  tracks: string;
  trackList?: Track[];
};

export type Artist = {
  index: number;
  name: string;
  tracks: string;
  trackList?: Track[];
  cover: string;
};

/**
 * 解析音频文件元数据
 * @param trackSrc 音频文件地址
 * @returns 解析后的音频对象
 */
export async function readMusicMeta(trackSrc: string): Promise<Track> {
  const buffer = await fs.readFile(trackSrc);
  const stats = await fs.stat(trackSrc);

  const meta = await mm.parseBuffer(buffer);
  if (!meta) return;

  const albumName = meta.common?.album || 'unknown';
  const artistName = meta.common?.artist || 'unknown';

  const coverPath = path.join(APP_DATA_PATH, APP_NAME, 'Cover');
  await fse.ensureDir(coverPath);
  const albumPath = path.join(
    coverPath,
    strToBase64(albumName + artistName) + '.png'
  );

  if (await fse.exists(albumPath)) {
    logger.debug('album cover existed: ' + albumPath);
  } else {
    logger.debug('no cover file, read from music meta');
    const data = meta.common?.picture ? meta.common.picture[0].data : null;
    if (data) {
      logger.debug('music meta cover existed');
      await fs.writeFile(albumPath, data);
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
    albumArtist: meta?.common?.albumartist,
    //
    duration: meta?.format?.duration,
    date: String(meta?.common?.date),
    genre: String(meta?.common?.genre),
    cover: albumPath,
    //
  };
}

export function arrayBufferToBase64(u8Arr: Buffer | null) {
  if (!u8Arr) return '';
  const chunk = 0x8000;
  let index = 0;
  const length = u8Arr.length;
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
      new winston.transports.File({
        level: 'debug',
        filename: logFilePath,
        maxsize: 1024 * 1024 * 4,
      }),
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
  playlist: Track[];
  [key: string]:
    | string
    | number
    | boolean
    | object
    | Array<string | number | boolean | object>;
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
      playlist: [],
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

export async function saveCover(url: string, name: string) {
  logger.debug('get cover from url: ' + url);
  const resp = await axios.get(url, { responseType: 'arraybuffer' });
  const data = resp?.data;

  const coverPath = path.join(
    APP_DATA_PATH,
    APP_NAME,
    'Cover',
    strToBase64(name) + '.png'
  );

  if (data) {
    logger.debug('get cover from network success');
    logger.debug('write cover to: ' + coverPath);
    await fse.writeFile(coverPath, data);
    return arrayBufferToBase64(data);
  }
}
