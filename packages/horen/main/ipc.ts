/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:40:55
 * @LastEditTime : 2022-01-26 17:53:01
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\ipc.ts
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
} from '../configs';
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
  const files = await readDir(p);

  // 判断是否是可以播放的音频格式
  const finalPaths = files.filter((f) => {
    const src = path.resolve(f);
    const ext = path.extname(src).replace('.', '');
    return TRACK_FORMAT.includes(ext);
  });

  // 解析音频列表
  const tracksToSave = await parseTracks(finalPaths);

  let finalTracksToSave = [];

  // 如果需要清空数据库重新生成
  if (clear) {
    try {
      await TrackModel.destroy({ truncate: true });
      finalTracksToSave = tracksToSave;
      mydebug('清空数据库并重新生成');
    } catch (err) {
      throw new Error('清空数据库失败');
    }
  } else {
    // 如果不需要重复生成则检查是否已经存在相应数据
    finalTracksToSave = tracksToSave.filter(async (track) => {
      const result = await TrackModel.findOne({ where: { md5: track.md5 } });
      if (result) {
        mydebug('音频信息已经存在 跳过: ' + track.title);
        return false;
      } else return true;
    });
  }

  // 尝试写入数据库
  try {
    await TrackModel.bulkCreate(finalTracksToSave);
    mydebug('save the file list to db success.');
  } catch (err) {
    mydebug('save the file list to db failed.');
  }

  return tracksToSave;
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
async function parseTracks(paths: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tracksToSave: any[] = [];

  for (const p of paths) {
    const meta = await readMusicMeta(p);
    tracksToSave.push(meta);
  }

  return tracksToSave;
}

/**
 * 解析音频文件元数据
 * @param p 音频文件地址
 * @returns 解析后的音频对象
 */
async function readMusicMeta(p: string) {
  try {
    const buffer = await fs.readFile(path.resolve(p));
    const stats = await fs.stat(path.resolve(p));

    const meta = await mm.parseBuffer(buffer);
    const { picture } = meta.common;
    const arrybuffer = picture && picture[0].data;
    return {
      createAt: stats.birthtime.valueOf(),
      modifiedAt: stats.mtime.valueOf(),
      updateAt: stats.ctime.valueOf(),
      ...meta.common,
      src: p,
      picture: arrybuffer ? arrayBufferToBase64(arrybuffer) : '',
      md5: getMd5(buffer),
    } as Track;
  } catch (err) {
    throw new Error(String(err));
  }
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
