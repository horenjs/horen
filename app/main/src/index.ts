import { BrowserWindow, app, dialog, ipcMain } from 'electron';
import { createMainWindow } from './app';
import fs from 'fs/promises';
import path from 'path';
import { APP_DATA_PATH, APP_NAME, CHANNELS } from './constant';
import { JSONFilePreset } from 'lowdb/node';
import type { Low } from 'lowdb';

let win: BrowserWindow = null;
let db: Low<DBData> = null;

type DBData = {
  setting: Record<string, any>;
};

app.whenReady().then(async () => {
  db = await JSONFilePreset<DBData>(
    path.join(APP_DATA_PATH, APP_NAME, 'db.json'),
    {
      setting: {},
    }
  );
  win = createMainWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('walk-dir', async (evt, dir: string) => {
  const files = await walkDir(dir);
  return files.map((file) => strToBase64(file));
});

ipcMain.handle('get-a-file', async (evt, filename: string) => {
  const base64 = await fs.readFile(base64toStr(filename), {
    encoding: 'base64',
  });
  return 'data:audio/wav;base64,' + base64;
});

ipcMain.handle('open-dialog', async (evt) => {
  return await dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'multiSelections'],
  });
});

ipcMain.handle(CHANNELS.setSetting, async (evt, key: string, value: any) => {
  console.log(key, value);
  await db.update(({ setting }) => (setting[key] = value));
});

ipcMain.handle(CHANNELS.closeMainWindow, async (evt) => {
  win.destroy();
});

const strToBase64 = (str: string) => {
  const buf = Buffer.from(str, 'utf-8');
  return buf.toString('base64');
};

const base64toStr = (base64str: string) => {
  const buf = Buffer.from(base64str, 'base64');
  return buf.toString('utf-8');
};

const walkDir = async (dirname: string, storeList: string[] = []) => {
  const files = await fs.readdir(dirname);

  for (const file of files) {
    const fullpath = path.join(dirname, file);
    const stats = await fs.stat(fullpath);
    if (stats.isFile()) storeList.push(fullpath);
    if (stats.isDirectory()) {
      await walkDir(fullpath, storeList);
    }
  }

  return storeList;
};
