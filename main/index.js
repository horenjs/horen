const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const { openFiles } = require("./ipc");
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

// app configuration
let config;
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

/*
function createListWindow (position) {
  const w = new BrowserWindow({
    width: 300,
    height: 302,
    frame: false,
    transparent: true,
    x: position[0] + 605,
    y: position[1],
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // this config make react use electron.
      webSecurity: false,
    }
  });

  w.loadURL("http://localhost:8080/#/list");
  w.setMovable(true);
  w.hide();

  return w;
} */

app.whenReady().then(() => {
  mainWindow = createWindow();
  /**
   * set system tray icon
   */
  // setTray();

  // only in macOS
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })

  mainWindow.on('ready-to-show', () => {
    fs.readFile(path.resolve(__dirname, '../public/config.json'), (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const defaultConfig = JSON.parse(data);
        // console.log(config);
        
        fs.readFile(path.resolve(__dirname, '../public/config.user.json'), (e, d) => {
          if (!e) {
            config = _.merge(defaultConfig, JSON.parse(d));

            mainWindow.webContents.send('config', config);
          }
        })
      }
    })
  });

  // list window follows the main window
  /* mainWindow.on('moved', () => {
    listWindow.setPosition(mainWindow.getPosition()[0] + 605, mainWindow.getPosition()[1]);
    // console.log(listWindow.getPosition());
  }) */
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