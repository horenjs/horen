import path from 'path';
import fsp from 'fs/promises';
import { PlayList } from 'types';
import myapp from '../app';
import { readDir } from '../utils/fs-extra.util';
import loggerUtil from '../utils/logger.util';
import { APP_NAME } from 'constant';

const mylogger = loggerUtil('ipc:playlist');
const APP_DATA_PATH = myapp.app.getPath('appData');

/**
 * get all play lists
 * @returns PlayList
 */
export async function handleGetPlaylist() {
  const files = await readDir(path.join(APP_DATA_PATH, APP_NAME));

  const playlist = files.filter((f) => {
    if (path.extname(f) === '.pyl') return f;
  });

  const playLists = [];

  for (const pyl of playlist) {
    try {
      const file = await fsp.readFile(pyl, { encoding: 'utf-8' });
      mylogger.debug('读取播放列表: ' + pyl);
      playLists.push(JSON.parse(file));
    } catch (err) {
      console.error(err);
      mylogger.error('读取播放列表失败: ' + pyl);
    }
  }

  return playLists;
}

/**
 * set play list
 * @param evt Electron.IpcMainInvokeEvent
 * @param pyl Play list
 */
export async function handleSetPlaylist(
  evt: Electron.IpcMainInvokeEvent,
  pyl: PlayList
) {
  const p = path.join(APP_DATA_PATH, APP_NAME, pyl.title + '.pyl');

  try {
    await fsp.writeFile(p, JSON.stringify(pyl, null, 2), { encoding: 'utf-8' });
    mylogger.info('保存播放列表成功: ' + pyl.title);
  } catch (err) {
    console.error(err);
    mylogger.error('保存播放列表失败: ' + pyl.title);
  }
}

/**
 * get one play list by title
 * @param evt Electron.IpcMainInvokeEvent
 * @param title play list title
 * @returns play list
 */
export async function handleGetPlaylistByTitle(
  evt: Electron.IpcMainInvokeEvent,
  title: string
) {
  const p = path.join(APP_DATA_PATH, APP_NAME, title + '.pyl');

  try {
    const file = await fsp.readFile(p, { encoding: 'utf-8' });
    mylogger.info('获取播放列表成功: ' + title);
    return JSON.parse(file);
  } catch (err) {
    console.log(err);
    mylogger.error('获取播放列表失败: ' + title);
  }
}
