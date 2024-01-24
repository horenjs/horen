import type { IpcMainInvokeEvent } from 'electron';
import { db } from './index';

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
