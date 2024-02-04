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
  handleRefreshCover,
  handleRefreshTrackList,
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
import path from 'path';
export let mainWindow: BrowserWindow = null;
export let db: Low<DBDataType> = null;
export let cacheDB: Low<{ tracks: Track[] }> = null;
export let logger: Logger = null;

if (!app.isDefaultProtocolClient('app')) {
  app.setAsDefaultProtocolClient('app');
}

// remove so we can register each time as we run the app.
app.removeAsDefaultProtocolClient('app');

// If we are running a non-packaged version of the app && on windows
if (process.env.NODE_ENV === 'development' && process.platform === 'win32') {
  // Set the path of electron.exe and your app.
  // These two additional parameters are only available on windows.
  app.setAsDefaultProtocolClient('app', process.execPath, [
    path.resolve(process.argv[1]),
  ]);
} else {
  app.setAsDefaultProtocolClient('app');
}

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
  logger = initLogger();
  logger.debug('app is ready');
  logger.debug('init the database');
  db = await initDatabase();
  cacheDB = await initCacheDB();
  logger.debug('create main window');

  protocol.handle('horen', (request) => {
    const url = 'file:///' + decodeURI(request.url.slice('horen:///'.length));
    logger.debug('origin request: ' + request.url);
    logger.debug('transform request: ' + url);
    return net.fetch(url);
  });
  protocol.handle('audio', (request) => {
    const url = 'file:///' + decodeURI(request.url.slice('audio:///'.length));
    logger.debug('origin request: ' + request.url);
    logger.debug('transform request: ' + url);
    return net.fetch(url, { bypassCustomProtocolHandlers: true });
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
ipcMain.handle(CHANNELS.refresh.albumCover, handleRefreshCover);

ipcMain.handle(CHANNELS.db.read, handleDBRead);
ipcMain.handle(CHANNELS.db.write, handleDBWrite);
