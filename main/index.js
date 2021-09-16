const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const { openFiles } = require("./ipc");
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const { musicMeta } = require('./ipc');

// app configuration
let appConfig;
// main window
let mainWindow;
// let lyricWindow;
let listWindow;

function createWindow () {
  const w = new BrowserWindow({
    width: 602,
    height: 302,
    frame: false,
    // resizable: false,
    // movable: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // this config make react use electron.
      webSecurity: false,
    }
  })

  w.loadURL("http://localhost:8080/#/home");

  return w;
}

app.whenReady().then(() => {
  // create main window
  mainWindow = createWindow();
  // only in macOS
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })

  mainWindow.on('ready-to-show', () => {
    const defaultConfigPath = path.resolve(__dirname, '../public/config.json');
    const userConfigPath = path.resolve(__dirname, '../public/config.user.json');

    fs.readFile(defaultConfigPath, (err, data) => {
      if (!err) {
        fs.readFile(userConfigPath, async (e, d) => {
          if (!e) {
            const defaultConfig = JSON.parse(data);
            const userConfig = JSON.parse(d);

            appConfig = _.merge(defaultConfig, userConfig);

            const songList = appConfig.songList;
            const finalSongList = [];

            for (let i = 0; i < songList.length; i ++) {
              const p = songList[i].path;
              const metaData = await musicMeta(p);
              finalSongList.push({path: p, ...metaData});
            }

            appConfig.songList = finalSongList;

            // send app config while app is ready.
            mainWindow.webContents.send('config', appConfig);
          }
        })
      }
    })
  });
})

app.on("window-all-closed", function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

/**
 * 系统托盘
 */
/* const setTray = () => {
  let appTray = null;
  let trayMenuTemplate = [
    {
      label: '退出',
      click: () => app.quit(),
    },
    {
      label: '显示主界面',
      click: () => mainWindow.maximize(),
    }
  ];

  let trayIcon = path.join(__dirname, '../public/favicon.ico');

  appTray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  appTray.setToolTip('A Pure Player');

  appTray.setContextMenu(contextMenu);
} */


ipcMain.on('quit', () => app.quit());
ipcMain.on('minimize', () => mainWindow.minimize());
ipcMain.on('setting-open-files', openFiles);
ipcMain.on('progress', (event, arg) => mainWindow.setProgressBar(arg / 100));
ipcMain.on('title', (event, arg) => mainWindow.setTitle(arg));