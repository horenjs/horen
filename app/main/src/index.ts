import { app, BrowserWindow, ipcMain } from 'electron';

import { createMainWindow } from './app';
import { CHANNELS } from './constant';
import {
  handleCloseMainwindow,
  handleOpenDialog,
  handleReadSetting,
  handleReadTrackList,
  handleRefreshTrackList,
  handleWriteLibraries,
  handleReadTrack,
  handleReadAudioSource,
  handleReadLibraries,
  handleReadCoverSource,
  handleReadDBStore,
} from './ipc';
import {
  DBDataType,
  initCacheDB,
  initDatabase,
  initLogger,
  Track,
} from './utils';

import type { Low } from 'lowdb';
import type { Logger } from 'winston';

export let mainWindow: BrowserWindow = null;
export let db: Low<DBDataType> = null;
export let cacheDB: Low<{ tracks: Track[] }> = null;
export let logger: Logger = null;

app.whenReady().then(async () => {
  logger = initLogger();
  logger.debug('app is ready');
  logger.debug('init the database');
  db = await initDatabase();
  cacheDB = await initCacheDB();
  logger.debug('create main window');
  mainWindow = createMainWindow();
});

app.on('activate', () => {
  logger.debug('app is activate');
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on('window-all-closed', () => {
  logger.debug('window all closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle(CHANNELS.setting.read, handleReadSetting);
// ipcMain.handle(CHANNELS.setting.write, null);

ipcMain.handle(CHANNELS.mainWindow.close, handleCloseMainwindow);
// ipcMain.handle(CHANNELS.mainWindow.minimize, null);
// ipcMain.handle(CHANNELS.mainWindow.maximize, null);

ipcMain.handle(CHANNELS.openDialog, handleOpenDialog);

ipcMain.handle(CHANNELS.track.read, handleReadTrack);

// ipcMain.handle(CHANNELS.trackList.write, null);
ipcMain.handle(CHANNELS.trackList.read, handleReadTrackList);
ipcMain.handle(CHANNELS.trackList.refresh, handleRefreshTrackList);

ipcMain.handle(CHANNELS.libraries.write, handleWriteLibraries);
ipcMain.handle(CHANNELS.libraries.read, handleReadLibraries);

ipcMain.handle(CHANNELS.readAudioSource, handleReadAudioSource);
ipcMain.handle(CHANNELS.readCoverSource, handleReadCoverSource);
ipcMain.handle(CHANNELS.readDBStore, handleReadDBStore);
