import type { IpcMainInvokeEvent } from 'electron';
import { db } from './index';
import { walkDir, readMusicMeta, getExt } from './utils';
import { AUDIO_EXTS } from './constant';

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
  console.log('to fresh track list');

  await db.read();
  const libs = db.data.libraries;
  const filePaths = [];

  for (const lib of libs) {
    console.log('walk lib: ', lib);
    const files = await walkDir(lib);
    console.log('read files: ', files);
    files.forEach((f) => {
      if (AUDIO_EXTS.includes(getExt(f))) filePaths.push(f);
    });
  }

  console.log('filepaths', filePaths);

  const paths = new Set(filePaths);
  console.log('paths: ', paths);

  const trackList = [];

  let i = 1;
  for (const p of paths) {
    console.log('read meta: ', p);
    const meta = await readMusicMeta(p);
    meta.cover = '';
    trackList.push({ ...meta, index: i });
    i += 1;
  }

  db.data.tracks = trackList;
  await db.write();
}
