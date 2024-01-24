import fs from 'fs/promises';
import { JSONFilePreset } from 'lowdb/node';
import mm from 'music-metadata';
import path from 'path';
import winston from 'winston';

import { APP_DATA_PATH, APP_NAME } from './constant';

import type { IAudioMetadata } from 'music-metadata';
export interface Track {
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

  const pictureBuffer = meta.common?.picture
    ? meta.common.picture[0].data
    : null;

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
    cover: 'data:image/png;base64,' + arrayBufferToBase64(pictureBuffer),
    //
  };
}

function arrayBufferToBase64(u8Arr: Buffer | null) {
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

const strToBase64 = (str: string) => {
  const buf = Buffer.from(str, 'utf-8');
  return buf.toString('base64url');
};

const base64toStr = (base64str: string) => {
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
};

export const initDatabase = async () => {
  const db = await JSONFilePreset<DBDataType>(
    path.join(APP_DATA_PATH, APP_NAME, 'db.json'),
    {
      setting: {},
      tracks: [],
      libraries: [],
    }
  );
  await db.write();
  return db;
};
