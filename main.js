const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = process.env.NODE_ENV === 'dev';

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 200,
    resizable: false,
    // titleBarStyle: 'hidden',
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  
  isDev
    ? win.loadURL('http://localhost:3000')
    : win.loadFile(path.join(__dirname, 'build/index.html'));

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('close-window', (event, arg) => {
  console.log(arg)
  event.reply('close-window-reply', 'pong')
})