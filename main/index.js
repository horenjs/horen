const { app, BrowserWindow } = require("electron");
const ipcs = require('./ipcs');

// main window
let mainWindow;

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

  /* read the app config while main window is ready to show
  mainWindow.on('ready-to-show', async () => {
    const appConfig = await readConfig();
    // console.log(appConfig);
    mainWindow.webContents.send('config:read', appConfig);
  }); */

  // ipc
  ipcs({app, mainWindow});
})

app.on("window-all-closed", function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
