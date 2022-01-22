/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:40:55
 * @LastEditTime : 2022-01-22 13:39:17
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\ipc.ts
 * @Description  :
 */
import path from 'path';
import mm from 'music-metadata';
import { ipcMain } from 'electron';
import { IPC_CODE, TRACK_FORMAT } from '../configs';
import { readDir, arrayBufferToBase64 } from 'horen-util';
import { Track } from '../types';

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
  } as any;
});
