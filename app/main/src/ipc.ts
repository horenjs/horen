import type { IpcMainInvokeEvent } from 'electron';
import fs from 'fs/promises';
import { db, logger } from './index';
import { walkDir, readMusicMeta, getExt } from './utils';
import { AUDIO_EXTS } from './constant';

export const handleGetAudioFile = async (
  evt: IpcMainInvokeEvent,
  filename: string
) => {
  const base64 = await fs.readFile(filename, {
    encoding: 'base64',
  });
  return 'data:audio/wav;base64,' + base64;
};

export async function handleWriteLibraries(
  evt: IpcMainInvokeEvent,
  libs: string[]
) {
  if (libs instanceof Array) {
    console.log('write libs: ', libs);
    db.data.libraries = libs;
    await db.write();
  }
}

export async function handleRefreshTrackList(evt: IpcMainInvokeEvent) {
  logger.debug('to fresh track list');

  await db.read();
  const libs = db.data.libraries;
  const filePaths = [];

  for (const lib of libs) {
    logger.debug(`read files from ${lib}`);
    const files = await walkDir(lib);

    files.forEach((f) => {
      if (AUDIO_EXTS.includes(getExt(f))) {
        logger.debug('add track: ' + f);
        filePaths.push(f);
      } else {
        logger.debug('not support audio format: ' + f);
      }
    });
  }

  logger.debug('track file paths ' + filePaths);
  logger.debug('use new Set() to in-depulicate');
  const paths = new Set(filePaths);
  const trackList = [];

  let i = 1;
  for (const p of paths) {
    logger.debug('read meta: ' + p);
    const meta = await readMusicMeta(p);
    meta.cover = '';
    trackList.push({ ...meta, index: i });
    i += 1;
  }

  logger.debug('write track list to lowdb');
  db.data.tracks = trackList;
  await db.write();
}
