import path from "path";
import fsp from 'fs/promises';
import { ipcMain } from 'electron';
import { PlayList } from 'types';
import myapp from "../app";
import { readDir } from "../utils/fs-extra";
import logger from '../utils/logger';
import { IPC_CODE, APP_NAME } from "constant";

const mylogger = logger('ipc:playlist');
const APP_DATA_PATH = myapp.app.getPath('appData');

ipcMain.handle(IPC_CODE.playlist.getList, async () => {
  const files = await readDir(path.join(APP_DATA_PATH, APP_NAME));

  const playlist = files.filter(f => {
    if (path.extname(f) === '.pyl') return f;
  })

  const playLists = [];

  for (const pyl of playlist) {
    try {
      const file = await fsp.readFile(pyl, {encoding: 'utf-8'});
      mylogger.debug('读取播放列表: ' + pyl);
      playLists.push(JSON.parse(file));
    } catch(err) {
      console.error(err);
      mylogger.error('读取播放列表失败: ' + pyl);
    }
  }

  return playLists;
})

ipcMain.handle(IPC_CODE.playlist.set, async (evt, pyl: PlayList) => {
  const p = path.join(APP_DATA_PATH, APP_NAME, pyl.title + '.pyl');

  try {
    await fsp.writeFile(p, JSON.stringify(pyl, null, 2), {encoding: 'utf-8'});
    mylogger.info('保存播放列表成功: ' + pyl.title);
  } catch(err) {
    console.error(err);
    mylogger.error('保存播放列表失败: ' + pyl.title);
  }
})

ipcMain.handle(IPC_CODE.playlist.get, async (evt, title: string) => {
  const p = path.join(APP_DATA_PATH, APP_NAME, title + '.pyl');

  try {
    const file = await fsp.readFile(p, {encoding: 'utf-8'});
    mylogger.info('获取播放列表成功: ' + title);
    return JSON.parse(file);
  } catch(err) {
    console.log(err);
    mylogger.error('获取播放列表失败: ' + title);
  }
})