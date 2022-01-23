/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:40:55
 * @LastEditTime : 2022-01-23 22:02:20
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\ipc.ts
 * @Description  :
 */
import path from 'path';
import fs from 'fs/promises';
import mm from 'music-metadata';
import { ipcMain } from 'electron';
import {
  IPC_CODE,
  TRACK_FORMAT,
  APP_DATA_PATH,
  APP_NAME,
  DEFAULT_SETTING,
} from '../configs';
import { readDir, arrayBufferToBase64 } from 'horen-util';
import { Setting, Track } from '../types';

ipcMain.handle(IPC_CODE.file.getList, async (evt, p) => {
  const files = await readDir(p);

  return files.filter((f) => {
    const src = path.resolve(f);
    const ext = path.extname(src).replace('.', '');
    return TRACK_FORMAT.includes(ext);
  });
});

ipcMain.handle(IPC_CODE.file.get, async (evt, p) => {
  const meta = await mm.parseFile(path.resolve(p));
  const { picture } = meta.common;
  const arrybuffer = picture && picture[0].data;
  return {
    ...meta.common,
    picture: arrybuffer ? arrayBufferToBase64(arrybuffer) : '',
  } as Track;
});

ipcMain.handle(IPC_CODE.setting.get, async (evt) => {
  const p = path.join(APP_DATA_PATH, APP_NAME, 'setting.user.json');

  try {
    await fs.stat(path.join(APP_DATA_PATH, APP_NAME));
  } catch(err) {
    await fs.mkdir(path.join(APP_DATA_PATH, APP_NAME));
  }

  try {
    const settingStr = await fs.readFile(p, { encoding: 'utf-8' });
    return JSON.parse(settingStr);
  } catch(err) {
    await fs.writeFile(p, JSON.stringify(DEFAULT_SETTING));
    return DEFAULT_SETTING;
  }
});

ipcMain.handle(IPC_CODE.setting.set, async (evt, setting) => {
  try {
    await fs.writeFile(
      path.join(APP_DATA_PATH, APP_NAME, 'setting.user.json'),
      JSON.stringify(setting, null, 2)
    );
  } catch (err) {
    console.log(err);
  }
});
