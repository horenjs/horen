const { app, BrowserWindow, ipcMain } = require("electron");
const { openFiles } = require("./ipc");

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  })

  mainWindow.loadURL("http://localhost:8080");
}

app.whenReady().then(() => {
  createWindow();

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

ipcMain.on('quit', () => app.quit());
ipcMain.on('minimize', () => mainWindow.minimize());
ipcMain.on('setting-open-files', openFiles);
