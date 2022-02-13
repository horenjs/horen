/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 14:55:06
 * @LastEditTime : 2022-02-04 13:03:55
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\main\ipc\track.ipc.ts
 * @Description  :
 */
import path from 'path';
import fs from 'fs/promises';
import { ipcMain } from 'electron';
import mm from 'music-metadata';
import { arrayBufferToBase64 } from 'mintin-util';
import { TRACK_FORMAT, IPC_CODE, API_URL } from 'constant';
import debug from '../utils/logger';
import {Album, Track} from 'types';
import { TrackModel, AlbumModel } from '../db/models';
import myapp from '../app';
import { request } from '../utils/request';
import { simplized } from '../utils/words';
import { readDir } from '../utils/fs-extra';
import lrcParser from '../utils/lyric';
import {aggregateAlbum, generateAlbumKey} from '../utils/track.util';

const mydebug = debug('ipc:track');

/**
 * 从缓存中获取音频文件列表
 */
ipcMain.handle(IPC_CODE.track.getTrackList, async () => {
  mydebug.info('从缓存数据库中读取');
  try {
    const allTracks = (await TrackModel.findAll()).map((t) => t.get());
    mydebug.info('从缓存数据库读取成功');
    return allTracks;
  } catch (err) {
    mydebug.error('从数据库中读取失败');
  }
});

ipcMain.handle(IPC_CODE.track.getAlbumList, async () => {
  mydebug.debug('从缓存数据库中读取专辑列表');
  try {
    const albums = (await AlbumModel.findAll()).map((a) => a.get());
    mydebug.debug('读取专辑列表成功');
    return albums;
  } catch(err) {
    console.error(err);
    mydebug.error('读取专辑列表失败');
  }
})

/**
 * 重建缓存并获取音频文件列表
 */
ipcMain.handle(IPC_CODE.track.rebuildCache, async (evt, paths: string[]) => {
  const rawFilePaths: string[] = [];

  for (const p of paths) {
    mydebug.info('从给定的目录读取所有文件: ' + p);
    rawFilePaths.push(...(await readDir(p)));
  }

  mydebug.info('过滤出音频文件');
  const audioFilePaths = getAudioFiles(rawFilePaths);

  mydebug.info('清空数据库并重新生成');
  try {
    await TrackModel.destroy({ truncate: true });
    await AlbumModel.destroy({ truncate: true });
    mydebug.info('清空数据库成功');
  } catch (err) {
    console.error(err);
    mydebug.error('清空数据库失败');
    return false;
  }
  mydebug.info('从音频文件中解析相关信息');
  const allTracks = await getAudioFilesMeta(
    audioFilePaths,
    audioFilePaths.length
  );

  mydebug.info('等待写入数据库');
  await saveToDB(allTracks);

  const albums = aggregateAlbum(allTracks);
  try {
    await AlbumModel.bulkCreate(albums as any[]);
    mydebug.info('保存专辑列表成功');
    myapp.mainWindow?.webContents.send(IPC_CODE.track.msg, 'done');
    return true;
  } catch(err) {
    console.error(err);
    mydebug.error('保存专辑列表失败');
    myapp.mainWindow?.webContents.send(IPC_CODE.track.msg, '保存专辑列表失败');
    return false;
  }
});

ipcMain.handle(IPC_CODE.track.getBySrc, async (evt, src: string) => {
  try {
    const result = await TrackModel.findOne({ where: { src } });
    if (result) {
      mydebug.info('获取音频成功: ' + src);
      return result.toJSON();
    } else {
      mydebug.error('获取音频失败: ' + src);
    }
  } catch (err) {
    mydebug.error('获取音频失败: ' + src);
  }
});

ipcMain.handle(IPC_CODE.track.getAlbumByKey, async (evt, key) => {
  try {
    const result = await TrackModel.findAll({where: {albumKey: key}});
    const tracks = result.map(r => r.toJSON()) as Track[];
    mydebug.debug(`获取专辑内的音频成功 [${key}]`);
    return {
      key,
      children: tracks,
    } as Album;
  } catch (err) {
    console.error(err);
    mydebug.error(`获取专辑内的音频失败 [${key}]`);
  }
})

/**
 * 获取歌词
 */
ipcMain.handle(IPC_CODE.track.lyric, async (evt, src: string) => {
  mydebug.info('获取歌词: ' + src);

  try {
    const file = await fs.readFile(audioExtToLrc(src), { encoding: 'utf-8' });
    mydebug.info('找到本地歌词文件');
    return lrcParser(file).scripts;
  } catch (err) {
    mydebug.warning('无法找到本地歌词文件');
  }

  try {
    const result = await TrackModel.findOne({ where: { src } });
    if (result) {
      const { title, artist } = result.toJSON();

      mydebug.debug(`从互联网获取歌词: ${title}, ${artist}`);

      const api = new NeteaseApi(simplized(title), simplized(artist));
      const lrc = await api.lyric();
      mydebug.info('获取歌词成功');
      mydebug.debug('保存歌词到文件: ' + audioExtToLrc(src));
      await fs.writeFile(audioExtToLrc(src), lrc, { encoding: 'utf-8' });

      return lrcParser(lrc).scripts;
    }
  } catch (err) {
    mydebug.error('获取歌词失败: ' + src);
  }
});

//
//
//
//
// 以下为工具函数
//
//
//
//

/**
 * 从所有文件中分离音频文件
 * @param files 源文件列表
 * @returns 音频文件列表
 */
function getAudioFiles(files: string[]) {
  return files.filter((f) => {
    const src = path.resolve(f);
    const ext = path.extname(src).replace('.', '');
    return TRACK_FORMAT.includes(ext);
  });
}

/**
 * 解析音频文件元数据
 * @param paths 音频文件地址列表
 * @param totals
 * @returns 解析后的音频文件数据
 */
async function getAudioFilesMeta(paths: string[], totals: number) {
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
 * 保存音频文件信息到缓存数据库
 * @param tracks 最终需要进行保存的音频列表
 */
async function saveToDB(tracks: Track[]) {
  const chunkSize = 200;
  const tracksToSave: any[] = await getTracksNotCached(tracks);
  for (let i = 0; i < tracks.length; i += chunkSize) {
    try {
      await TrackModel.bulkCreate(tracksToSave.slice(i, i + chunkSize));
      mydebug.info('写入数据库成功' + i + '-' + i + chunkSize);
    } catch (err) {
      console.error(err);
      mydebug.info('写入数据库失败' + i + '-' + i + chunkSize);
    }
  }
}

/**
 * 找到未缓存的音频文件
 * @param tracks 音频列表
 * @returns 过滤后的列表
 */
async function getTracksNotCached(tracks: Track[]) {
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
    console.error(err);
    mydebug.error('无法解析该文件: ' + p);
  }

  const picture = meta ? meta.common?.picture : '';
  const arrybuffer = picture ? picture[0].data : null;

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
    picture: arrybuffer ? arrayBufferToBase64(arrybuffer) : '',
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
    where: { src: track.src },
  });
  return !!result;
}

/**
 * 音频文件地址转换为歌词文件地址
 * @param src {string}
 * @returns
 */
function audioExtToLrc(src: string) {
  const parts = src.split('.');
  const newparts = parts.slice(0, -1);
  newparts.push('lrc');
  return newparts.join('.');
}

/**
 *
 */
class NeteaseApi {
  protected kw: string;

  constructor(protected title: string, protected artist: string) {
    this.kw = title + artist;
  }

  async search() {
    const payload = {
      s: this.kw,
      type: 1,
      offset: 0,
      total: true,
      limit: 10,
    };
    const res = await request(API_URL.search, payload);
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
    const res = JSON.parse((await request(API_URL.lrc, payload)) as string);
    if (res.code === 200) {
      // mydebug.debug(res.lrc.lyric);
      return res.lrc.lyric;
    } else return '';
  }
}
