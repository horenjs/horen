const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const { openFiles } = require("./ipc");
const path = require('path');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 602,
    height: 302,
    frame: false,
    // resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // this config make react use electron.
      webSecurity: false,
    }
  })

  mainWindow.loadURL("http://localhost:8080");
}

app.whenReady().then(() => {
  createWindow();

  /**
   * set system tray icon
   */
  setTray();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on("window-all-closed", function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

const setTray = () => {
  let appTray = null;
  let trayMenuTemplate = [
    {
      label: '退出',
      click: () => app.quit(),
    },
    {
      label: '显示主界面',
      click: () => mainWindow.maximize()
    }
  ];

  let trayIcon = path.join(__dirname, '../public/favicon.ico');

  appTray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  appTray.setToolTip('A Pure Player');

  appTray.setContextMenu(contextMenu);
}

ipcMain.on('quit', () => app.quit());
ipcMain.on('minimize', () => mainWindow.minimize());
ipcMain.on('setting-open-files', openFiles);
ipcMain.on('progress', (event, arg) => mainWindow.setProgressBar(arg / 100));
ipcMain.on('title', (event, arg) => mainWindow.setTitle(arg));
