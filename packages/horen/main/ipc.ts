/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:40:55
 * @LastEditTime : 2022-01-27 22:47:46
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\ipc.ts
 * @Description  :
 */
import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises';
import mm from 'music-metadata';
import { ipcMain, dialog } from 'electron';
import debug from 'debug';
import {
  IPC_CODE,
  TRACK_FORMAT,
  APP_DATA_PATH,
  APP_NAME,
  DEFAULT_SETTING,
} from '../constant';
import { readDir, arrayBufferToBase64 } from 'horen-util';
import { SettingFile, Track } from '../types';
import myapp from './app';
import { TrackModel } from './db/models';

const mydebug = debug('horen:ipc');

/**
 * 获取歌曲文件列表
 */
ipcMain.handle(IPC_CODE.file.getList, async (evt, p, clear = false) => {
  mydebug('collection path: ' + p);

  // 从给定的目录读取所有文件
  mydebug('read all files from: ' + p);
  const files = await readDir(p);

  mydebug('过滤非可播放的音频文件');
  // 判断是否是可以播放的音频格式
  const filterPaths = files.filter((f) => {
    const src = path.resolve(f);
    const ext = path.extname(src).replace('.', '');
    mydebug('当前文件: ' + f);
    return TRACK_FORMAT.includes(ext);
  });

  const totals = filterPaths.length;

  // 解析音频列表
  mydebug('从音频文件中解析相关信息');
  const tracksToSaveTemp = await parseTracks(filterPaths, totals);

  let tracksToSaveParsed = [];

  // 如果需要清空数据库重新生成
  if (clear) {
    try {
      mydebug('清空数据库并重新生成');
      await TrackModel.destroy({ truncate: true });
      tracksToSaveParsed = tracksToSaveTemp;
    } catch (err) {
      throw new Error('清空数据库失败');
    }
  } else {
    // 如果不需要重复生成则检查是否已经存在相应数据
    tracksToSaveParsed = tracksToSaveTemp.filter(async (track) => {
      const result = await TrackModel.findOne({
        where: { md5: track.md5 },
      });
      if (result) {
        mydebug('音频信息已经存在 跳过: ' + track.title);
        return false;
      } else return true;
    });
  }

  // 尝试写入数据库
  mydebug('写入数据库成功');
  try {
    await TrackModel.bulkCreate(tracksToSaveParsed);
    mydebug('写入数据库成功');
  } catch (err) {
    mydebug('写入数据库失败');
  }

  myapp.mainWindow?.webContents.send(IPC_CODE.file.get, 'finished');

  return tracksToSaveParsed;
});

/**
 * 获取歌曲文件信息
 */
ipcMain.handle(IPC_CODE.file.get, async (evt, uuid) => {
  mydebug('get the song: ' + uuid);

  try {
    const result = await TrackModel.findOne({ where: { uuid: uuid } });
    if (result) return result;
  } catch (err) {
    mydebug('cannot get the track');
  }
});

/**
 * 获取设置选项
 */
ipcMain.handle(IPC_CODE.setting.get, async (evt) => {
  mydebug('get the setting');

  const p = path.join(APP_DATA_PATH, APP_NAME, 'setting.user.json');

  try {
    await fs.stat(path.join(APP_DATA_PATH, APP_NAME));
  } catch (err) {
    await fs.mkdir(path.join(APP_DATA_PATH, APP_NAME));
  }

  try {
    const settingStr = await fs.readFile(p, { encoding: 'utf-8' });
    const userSetting = JSON.parse(settingStr) as SettingFile;

    if (userSetting.version === DEFAULT_SETTING.version) {
      return userSetting;
    } else {
      await fs.writeFile(p, JSON.stringify(DEFAULT_SETTING));
      return DEFAULT_SETTING;
    }
  } catch (err) {
    await fs.writeFile(p, JSON.stringify(DEFAULT_SETTING));
    return DEFAULT_SETTING;
  }
});

/**
 * 更新设置选项
 */
ipcMain.handle(IPC_CODE.setting.set, async (evt, setting) => {
  mydebug('set the setting');

  try {
    await fs.writeFile(
      path.join(APP_DATA_PATH, APP_NAME, 'setting.user.json'),
      JSON.stringify(setting, null, 2)
    );
    mydebug('setting is update: ' + new Date());
  } catch (err) {
    mydebug('update the setting failed.');
    mydebug(err);
  }
});

/**
 * 监听对话框打开
 */
ipcMain.handle(IPC_CODE.dialog.open, async (evt, flag = 'dir') => {
  mydebug('to open dialog');

  if (myapp.mainWindow) {
    return await dialog.showOpenDialog(myapp.mainWindow, {
      properties: ['openDirectory', 'multiSelections'],
    });
  } else {
    mydebug('there is no main window');
  }
});

/**
 * 解析音频文件元数据
 * @param paths 音频文件地址列表
 * @returns 解析后的音频文件数据
 */
async function parseTracks(paths: string[], totals: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tracksToSave: any[] = [];

  let index = 0;

  for (const p of paths) {
    const msg = `共${totals}个，当前为第${index}个: ${p}`;
    mydebug(msg);

    // 向渲染进程主动发送文件读取情况
    myapp.mainWindow?.webContents.send(IPC_CODE.file.get, msg);

    const meta = await readMusicMeta(p);
    tracksToSave.push(meta);

    index += 1;
  }

  return tracksToSave;
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
