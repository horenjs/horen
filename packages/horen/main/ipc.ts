/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:40:55
 * @LastEditTime : 2022-01-25 23:46:52
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\ipc.ts
 * @Description  :
 */
import path from 'path';
import fs from 'fs/promises';
import mm from 'music-metadata';
import { ipcMain } from 'electron';
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

const mydebug = debug('horen:ipc');

ipcMain.handle(IPC_CODE.file.getList, async (evt, p) => {
  mydebug('collection path: ' + p);

  const files = await readDir(p);

  return files.filter((f) => {
    const src = path.resolve(f);
    const ext = path.extname(src).replace('.', '');
    return TRACK_FORMAT.includes(ext);
  });
});

// todo: 读取后应当将数据保存到数据库避免重复读取
ipcMain.handle(IPC_CODE.file.get, async (evt, p) => {
  mydebug('get the song: ' + p);

  try {
    const meta = await mm.parseFile(path.resolve(p));
    const { picture } = meta.common;
    const arrybuffer = picture && picture[0].data;
    return {
      ...meta.common,
      picture: arrybuffer ? arrayBufferToBase64(arrybuffer) : '',
    } as Track;
  } catch (err) {
    mydebug('read the music meta failed: ' + p);
  }
});

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
    console.log(err);
  }
});
