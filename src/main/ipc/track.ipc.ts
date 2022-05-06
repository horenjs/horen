/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 14:55:06
 * @LastEditTime : 2022-05-06 22:19:04
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\src\main\ipc\track.ipc.ts
 * @Description  :
 */
import path from 'path';
import fs from 'fs/promises';
import fsp from 'fs';
import { ipcMain } from 'electron';
import { APP_DATA_PATH, APP_NAME, IPC_CODE, COVER_PATH } from 'constant';
import { Album, LyricScript, Track } from 'types';
import { AlbumModel, TrackModel } from '../db/models';
import myapp from '../app';
import { simplized } from '../utils/char.util';
import { readDir, ensurePath } from '../utils/fs-extra.util';
import lrcParser from '../utils/lyric.util';
import { resp } from '../utils';
import {
  aggregateAlbum,
  audioExtToLrc,
  findArtistFromKey,
  findTitleFromKey,
  filterAudioFiles,
  extractAudioFilesMeta,
  NeteaseApi,
  arrayBufferToBuffer,
} from '../utils/track.util';
import Request from 'request';
import debug from '../utils/logger.util';

export const mydebug = debug('ipc:track');

/**
 * 获取音频列表（默认从缓存中）
 */
ipcMain.handle(IPC_CODE.track.getTrackList, async () => {
  mydebug.debug('从缓存数据库中读取音频列表');
  try {
    const allTracks = (await TrackModel.findAll()).map((t) => t.get());
    mydebug.info('从缓存数据库读取成功音频列表');
    return resp<Track[]>(1, '从缓存数据库读取成功音频列表', allTracks);
  } catch (err) {
    mydebug.error('从数据库中读取音频列表失败');
    return resp(1, '从数据库中读取音频列表失败');
  }
});

/**
 * 获取专辑列表
 */
ipcMain.handle(
  IPC_CODE.track.getAlbumList,
  async (evt, limit = 20, offset = 0) => {
    mydebug.debug('从缓存数据库中读取专辑列表');
    try {
      const albums = (await AlbumModel.findAll({ limit, offset })).map((a) =>
        a.get()
      );
      mydebug.info('读取专辑列表成功');
      return resp<Album[]>(1, '读取专辑列表成功', albums);
    } catch (err) {
      // console.error(err);
      mydebug.error('读取专辑列表失败');
      return resp(0, '读取专辑列表失败');
    }
  }
);

/**
 * 重建音频列表缓存
 */
ipcMain.handle(IPC_CODE.track.rebuildCache, async (evt, paths: string[]) => {
  const rawFilePaths: string[] = [];

  for (const p of paths) {
    mydebug.debug('[重建缓存]读取所有文件: ' + p);
    rawFilePaths.push(...(await readDir(p)));
  }

  mydebug.debug('[重建缓存]过滤所有音频文件');
  const audioFilePaths = filterAudioFiles(rawFilePaths);

  sendMsgToRenderer(`共有 ${audioFilePaths.length} 个文件`);

  mydebug.debug('[重建缓存]抽取所有音频元数据');
  const allTracks = await extractAudioFilesMeta(
    audioFilePaths,
    audioFilePaths.length
  );

  mydebug.warning('[重建缓存]清空缓存数据库');
  try {
    await TrackModel.destroy({ truncate: true });
    await AlbumModel.destroy({ truncate: true });
    mydebug.info('[重建缓存]清空数据库成功');
  } catch (err) {
    // console.error(err);
    mydebug.error('[重建缓存]清空数据库失败');
    return resp(0, '清空数据库失败');
  }

  mydebug.debug('[重建缓存]从音频列表中聚合专辑');
  const albums = aggregateAlbum(allTracks);
  for (const a of albums) {
    const api = new NeteaseApi(
      findTitleFromKey(a.key),
      findArtistFromKey(a.key)
    );
    const cover = await api.cover();
    mydebug.debug(`[重建缓存]获取专辑封面地址成功: ${cover}`);

    ensurePath(COVER_PATH);

    // encode the album name before save to the cover file
    // use hex encode method
    const albumName = Buffer.from(a.key).toString('hex');

    const imgPath = path.join(COVER_PATH, albumName + '.jpg');
    mydebug.debug(`保存专辑封面: ${imgPath}`);

    try {
      await fs.access(imgPath);
      mydebug.warning(`album cover exists: ${imgPath}`);
    } catch (err) {
      if (a.pb) {
        await fs.writeFile(imgPath, arrayBufferToBuffer(a.pb));
      } else {
        if (typeof cover !== 'undefined') {
          await Request(cover)
            .pipe(fsp.createWriteStream(imgPath))
            .on('close', () => {
              mydebug.debug(`[重建缓存]保存封面图成功: ${imgPath}`);
            });
        }
      }
    }
  }

  mydebug.debug('[重建缓存]将所有音频写入数据库');
  const saveSize = 200;
  for (let i = 0; i < allTracks.length; i += saveSize) {
    try {
      await TrackModel.bulkCreate(allTracks.slice(i, i + saveSize) as any[]);
      mydebug.info('[重建缓存]写入数据库成功' + i + '-' + (i + saveSize));
    } catch (err) {
      console.error(err);
      mydebug.info('[重建缓存]写入数据库失败' + i + '-' + (i + saveSize));
      return resp(0, '写入数据库失败');
    }
  }

  mydebug.debug('[重建缓存]将专辑列表写入数据库');
  try {
    await AlbumModel.bulkCreate(albums as any[]);
    mydebug.info('[重建缓存]保存专辑列表成功');
    myapp.mainWindow?.webContents.send(IPC_CODE.track.msg, 'done');
    return resp(1, '保存专辑列表成功');
  } catch (err) {
    // console.error(err);
    mydebug.error('[重建缓存]保存专辑列表失败');
    myapp.mainWindow?.webContents.send(IPC_CODE.track.msg, '保存专辑列表失败');
    return resp(0, '保存专辑列表失败');
  }
});

/**
 * 获取音频
 */
ipcMain.handle(IPC_CODE.track.getBySrc, async (evt, src: string) => {
  try {
    const result = await TrackModel.findOne({ where: { src } });
    if (result) {
      mydebug.debug('获取音频成功: ' + src);
      return resp<Track>(1, '获取音频成功', result.toJSON());
    } else {
      mydebug.error('获取音频失败: ' + src);
      return resp(0, '获取音频失败');
    }
  } catch (err) {
    mydebug.error('获取音频失败: ' + src);
    return resp(0, '获取音频失败');
  }
});

/**
 * 获取专辑
 */
ipcMain.handle(IPC_CODE.track.getAlbumByKey, async (evt, key) => {
  try {
    const result = await TrackModel.findAll({ where: { albumKey: key } });
    const tracks = result.map((r) => r.toJSON()) as Track[];
    mydebug.debug(`获取专辑内的音频成功 [${key}]`);
    return resp<Album>(1, '获取专辑内的音频成功', {
      key,
      children: tracks,
    } as Album);
  } catch (err) {
    // console.error(err);
    mydebug.error(`获取专辑内的音频失败 [${key}]`);
    return resp(0, `获取专辑内的音频失败 [${key}]`);
  }
});

/**
 * 获取专辑封面
 */
ipcMain.handle(IPC_CODE.track.getAlbumCover, async (evt, key) => {
  const albumHex = Buffer.from(key).toString('hex');
  const coverPath = path.join(APP_DATA_PATH, APP_NAME, 'Cache', 'cover');
  const imgPath = path.join(coverPath, albumHex + '.jpg');
  try {
    const result = fsp.readFileSync(imgPath, { encoding: 'base64' });
    if (result) return resp<string>(1, '获取封面成功', result);
    else return resp(0, `没有本地封面: ${imgPath}`);
  } catch (err) {
    // console.error(err);
    mydebug.warning(`没有本地封面: ${imgPath}`);
    return resp(0, `没有本地封面: ${imgPath}`);
  }
});

/**
 * 获取歌词
 */
ipcMain.handle(IPC_CODE.track.lyric, async (evt, src: string) => {
  mydebug.debug('获取歌词: ' + src);

  try {
    const file = await fs.readFile(audioExtToLrc(src), { encoding: 'utf-8' });
    mydebug.info('找到本地歌词文件');
    return resp<LyricScript[]>(1, `找到本地歌词文件`, lrcParser(file).scripts);
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

      return resp<LyricScript[]>(1, `从互联网找到歌词`, lrcParser(lrc).scripts);
    }
  } catch (err) {
    mydebug.error('获取歌词失败: ' + src);
    return resp(0, '获取歌词失败');
  }
});

const sendMsgToRenderer = (msg: string) => {
  myapp.mainWindow?.webContents.send(IPC_CODE.track.msg, msg);
};
