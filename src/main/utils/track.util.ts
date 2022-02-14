import {Album, Track} from "types";
import myapp from "../app";
import {API_URL, IPC_CODE, AUDIO_EXTS} from "constant";
import {post} from "./request.util";
import fs from "fs/promises";
import path from "path";
import mm from "music-metadata";
import {arrayBufferToBase64} from "mintin-util";
import {TrackModel} from "../db/models";
import {mydebug} from "../ipc/track.ipc";

/**
 * 对音频列表进行重排并聚合为专辑列表
 * @param tracks 音频列表
 * @returns 重新聚合后的专辑列表
 */
export function aggregateAlbum(tracks: Track[]) {
  const albums: Album[] = [];

  for (const track of tracks) {
    const key = generateAlbumKey(track);
    const pb = track.pictureBuffer;
    // 如有没有这个专辑名 则新建一个
    if (!includesAlbum(albums, key)) albums.push({ key, pb });
  }

  return albums;
}

export function generateAlbumKey(t?: Track) {
  if (t?.album) {
    if (t?.artist) return `#${t.album}#@${t.artist}@`;
    else return `#${t.album}#@Unkown@`;
  } else return `#default#@Unkown@`;
}

export function generateTrackTitle(track: Track) {
  return track.title || track.src?.split('\\').pop();
}

export function includesAlbum(albums: Album[], key: string) {
  return albums.filter((album) => album.key === key).length > 0;
}

export function findTitleFromKey(key: string) {
  const result = key.match(/#[\S\s]+#/gi);
  if (result) return result[0].replace(/#/, '').replace(/#/, '');
  else return '';
}

export function findArtistFromKey(key: string) {
  const result = key.match(/@[\S\s]+@/gi);
  if (result) return result[0].replace(/@/, '').replace(/@/, '');
  else return '';
}

/**
 * 从所有文件中分离音频文件
 * @param files 源文件列表
 * @returns 音频文件列表
 */
export function filterAudioFiles(files: string[]) {
  return files.filter((f) => {
    const src = path.resolve(f);
    const ext = path.extname(src).replace('.', '');
    return AUDIO_EXTS.includes(ext);
  });
}

/**
 * 解析音频文件元数据
 * @param paths 音频文件地址列表
 * @param totals
 * @returns 解析后的音频文件数据
 */
export async function extractAudioFilesMeta(paths: string[], totals: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tracks: any[] = [];

  let index = 1;

  for (const p of paths) {
    const msg = `共${totals}个，当前为第${index}个: ${p}`;

    // 向渲染进程主动发送文件读取情况
    myapp.mainWindow?.webContents.send(IPC_CODE.track.msg, msg);

    const meta = await readMusicMeta(p);
    tracks.push(meta);

    index += 1;
  }

  return tracks;
}

/**
 * 找到未缓存的音频文件
 * @param tracks 音频列表
 * @returns 过滤后的列表
 */
export async function getTracksNotCached(tracks: Track[]) {
  const temp = [];
  for (const track of tracks) {
    const cached = await isCached(track);
    if (!cached) {
      // mydebug('未缓存，加入缓存列表: ' + track.title);
      temp.push(track);
    } else {
      // mydebug('已经缓存: ' + track.title);
    }
  }
  return temp;
}

/**
 * 解析音频文件元数据
 * @param p 音频文件地址
 * @returns 解析后的音频对象
 */
async function readMusicMeta(p: string) {
  const buffer = await fs.readFile(path.resolve(p));
  const stats = await fs.stat(path.resolve(p));
  let meta;

  try {
    meta = await mm.parseBuffer(buffer);
  } catch (err) {
    meta = null;
    // console.error(err);
    mydebug.error('无法解析该文件: ' + p);
  }

  const picture = meta ? meta.common?.picture : '';
  const pictureBuffer = picture ? picture[0].data : null;

  return {
    createAt: stats.birthtime.valueOf(),
    updateAt: stats.ctime.valueOf(),
    modifiedAt: stats.mtime.valueOf(),
    //uuid
    src: p,
    title: String(meta?.common?.title),
    artist: String(meta?.common?.artist),
    artists: String(meta?.common?.artists),
    album: String(meta?.common?.album),
    //
    duration: meta?.format?.duration,
    date: String(meta?.common?.date),
    genre: String(meta?.common?.genre),
    picture: pictureBuffer ? arrayBufferToBase64(pictureBuffer) : '',
    pictureBuffer: pictureBuffer,
    //
    albumKey: generateAlbumKey(meta?.common as Track),
  } as Track;
}

/**
 *
 * @returns
 * @param track
 */
async function isCached(track: Track) {
  const result = await TrackModel.findOne({
    where: {src: track.src},
  });
  return !!result;
}

/**
 * 音频文件地址转换为歌词文件地址
 * @param src {string}
 * @returns
 */
export function audioExtToLrc(src: string) {
  const parts = src.split('.');
  const newParts = parts.slice(0, -1);
  newParts.push('lrc');
  return newParts.join('.');
}

/**
 *
 */
export class NeteaseApi {
  protected kw: string;

  constructor(protected title: string, protected artist: string) {
    this.kw = title + artist;
  }

  async search(type = 1) {
    const payload = {
      s: this.kw,
      type,
      offset: 0,
      total: true,
      limit: 10,
    };
    const res = await post(API_URL.search, payload);
    return res as string;
  }

  async uid() {
    const jsonStr = JSON.parse(await this.search());
    if (jsonStr.result) {
      const songList = jsonStr.result.songs;
      for (const song of songList) {
        if (song.name === this.title) {
          const artists = song.artists;
          for (const artist of artists) {
            if (artist.name === this.artist) {
              mydebug.info('搜索的歌曲 id: ' + song.id);
              return song.id;
            }
          }
        }
      }
    }
  }

  async lyric(): Promise<string> {
    const uid = await this.uid();
    const payload = {
      id: uid,
      lv: -1,
    };
    const res = JSON.parse((await post(API_URL.lrc, payload)) as string);
    if (res.code === 200) {
      // mydebug.debug(res.lrc.lyric);
      return res.lrc.lyric;
    } else return '';
  }

  async cover() {
    const jsonStr = JSON.parse(await this.search(10));
    // console.log(jsonStr);
    if (jsonStr.result) {
      if (jsonStr.result.albumCount > 0) {
        const albumList = jsonStr.result.albums;
        for (const album of albumList) {
          if (album.name === this.title) {
            const artists = album.artists;
            for (const artist of artists) {
              if (artist.name === this.artist) {
                mydebug.info('搜索的专辑名称: ' + album.name);
                return album.picUrl;
              }
            }
          }
        }
      }
    }
  }
}

export function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) buf[i] = view[i];
  return buf;
}