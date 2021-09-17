const { ipcMain } = require('electron');

module.exports = (mainWindow) => {
  ipcMain.on('progress', (event, arg) => mainWindow.setProgressBar(arg / 100));

  ipcMain.on('title', (event, arg) => mainWindow.setTitle(arg));
}