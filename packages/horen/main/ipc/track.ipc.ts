/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 14:55:06
 * @LastEditTime : 2022-01-28 16:37:51
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\ipc\track.ipc.ts
 * @Description  :
 */
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { ipcMain } from 'electron';
import { TRACK_FORMAT, IPC_CODE } from '../../constant';
import debug from 'debug';
import { readDir, arrayBufferToBase64 } from 'horen-util';
import { Track } from '../../types';
import { TrackModel } from '../db/models';
import myapp from '../app';
import mm from 'music-metadata';

const mydebug = debug('horen:ipc:track');
/**
 * 获取歌曲文件列表
 */
ipcMain.handle(IPC_CODE.track.getList, async (evt, p, opts) => {
  const { rebuild = false, fromCache = true } = opts;

  mydebug('从给定的目录读取所有文件: ' + p);
  const rawFilePaths = await readDir(p);

  mydebug('过滤非可播放的音频文件');
  const audioFilePaths = getAudioFiles(rawFilePaths);

  let finalTracks = [];

  mydebug('从音频文件中解析相关信息');
  const allTracks = await getAudioFilesMeta(
    audioFilePaths,
    audioFilePaths.length
  );

  if (rebuild) {
    mydebug('清空数据库并重新生成');
    try {
      await TrackModel.destroy({ truncate: true });
      mydebug('清空数据库成功');
      finalTracks = allTracks;
    } catch (err) {
      throw new Error('清空数据库失败');
    }
  }

  if (fromCache) {
    mydebug('从缓存数据库中读取');
    try {
      finalTracks = (await TrackModel.findAll()).map((t) => t.get());
      mydebug('从缓存数据库读取成功');
    } catch (err) {
      mydebug('从数据库中读取失败');
    }
  } else {
    finalTracks = allTracks;
    await saveToDB(finalTracks);
  }

  myapp.mainWindow?.webContents.send(IPC_CODE.track.get, 'done');

  return finalTracks;
});

/**
 * 获取歌曲文件信息
 */
ipcMain.handle(IPC_CODE.track.get, async (evt, uuid) => {
  mydebug('音频文件 uuid:' + uuid);

  try {
    const result = await TrackModel.findOne({ where: { uuid: uuid } });
    if (result) return result;
  } catch (err) {
    mydebug('无法获取音频文件');
  }
});

//
//
//
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
 * @returns 解析后的音频文件数据
 */
async function getAudioFilesMeta(paths: string[], totals: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tracks: any[] = [];

  let index = 1;

  for (const p of paths) {
    const msg = `共${totals}个，当前为第${index}个: ${p}`;

    // 向渲染进程主动发送文件读取情况
    myapp.mainWindow?.webContents.send(IPC_CODE.track.get, msg);

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
  const tracksToSave = await getTracksNotCached(tracks);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await TrackModel.bulkCreate(tracksToSave as any[]);
    mydebug('写入数据库成功');
  } catch (err) {
    mydebug('写入数据库失败');
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
      mydebug('未缓存，加入缓存列表: ' + track.title);
      temp.push(track);
    } else mydebug('已经缓存: ' + track.title);
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
    mydebug(err);
  }

  const picture = meta?.common?.picture;
  const arrybuffer = picture ? picture[0].data : null;

  return {
    createAt: stats.birthtime.valueOf(),
    modifiedAt: stats.mtime.valueOf(),
    updateAt: stats.ctime.valueOf(),
    ...meta?.common,
    src: p,
    duration: meta?.format.duration,
    picture: arrybuffer ? arrayBufferToBase64(arrybuffer) : '',
    md5: getMd5(buffer),
  } as Track;
}

/**
 * 获取字符串的md5值
 * @param s 传入的字符串
 * @returns md5值
 */
function getMd5(buf: Buffer) {
  const hash = crypto.createHash('md5');
  hash.update(buf);
  return hash.digest('hex');
}

/**
 *
 * @param tracks
 * @returns
 */
async function isCached(track: Track) {
  const result = await TrackModel.findOne({
    where: { md5: track.md5 },
  });
  if (result) return true;
  else return false;
}
