import fs from 'fs/promises';
import mm from 'music-metadata';
import type { IAudioMetadata } from 'music-metadata';

export interface Track {
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
    createAt: stats.birthtime.toJSON(),
    updateAt: stats.ctime.toJSON(),
    modifiedAt: stats.mtime.toJSON(),
    //uuid
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
  return buf.toString('base64');
};

const base64toStr = (base64str: string) => {
  const buf = Buffer.from(base64str, 'base64');
  return buf.toString('utf-8');
};
