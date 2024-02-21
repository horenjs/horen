import { app, BrowserWindow, ipcMain, net, protocol } from 'electron';

import { createMainWindow } from './app';
import { CHANNELS } from './constant';
import {
  handleCloseMainwindow,
  handleDBRead,
  handleDBWrite,
  handleMaximizeMainwindow,
  handleMinimizeMainwindow,
  handleOpenDialog,
  handleRefreshTrackList,
  handleFetchCoverFromInternet,
  hanldeWriteCoverToFile,
  handleGetLyric,
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

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'horen',
    privileges: { bypassCSP: true, standard: false },
  },
  {
    scheme: 'audio',
    privileges: { bypassCSP: true, standard: false, stream: true },
  },
]);

app.whenReady().then(async () => {
  logger = await initLogger();
  logger.debug('app is ready');
  logger.debug('init the database');
  db = await initDatabase();
  cacheDB = await initCacheDB();
  logger.debug('create main window');

  protocol.handle('horen', (request) => {
    const url = 'file:///' + decodeURI(request.url.slice('horen:///'.length));
    // logger.debug('origin request: ' + request.url);
    // logger.debug('transform request: ' + url);
    try {
      return net.fetch(url);
    } catch (err) {
      logger.debug('cannot get the resource: ' + url);
    }
  });

  protocol.handle('audio', (request) => {
    const url = 'file:///' + decodeURI(request.url.slice('audio:///'.length));
    // logger.debug('origin request: ' + request.url);
    // logger.debug('transform request: ' + url);
    try {
      return net.fetch(url, { bypassCustomProtocolHandlers: true });
    } catch (err) {
      logger.debug('cannot get the resource: ' + url);
    }
  });

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

ipcMain.handle(CHANNELS.mainWindow.close, handleCloseMainwindow);
ipcMain.handle(CHANNELS.mainWindow.minimize, handleMinimizeMainwindow);
ipcMain.handle(CHANNELS.mainWindow.maximize, handleMaximizeMainwindow);

ipcMain.handle(CHANNELS.openDialog, handleOpenDialog);

ipcMain.handle(CHANNELS.refresh.trackList, handleRefreshTrackList);

ipcMain.handle(CHANNELS.db.read, handleDBRead);
ipcMain.handle(CHANNELS.db.write, handleDBWrite);

ipcMain.handle(CHANNELS.cover.fetchFromInternet, handleFetchCoverFromInternet);
ipcMain.handle(CHANNELS.cover.writeToFile, hanldeWriteCoverToFile);

ipcMain.handle(CHANNELS.lyric.get, handleGetLyric);
