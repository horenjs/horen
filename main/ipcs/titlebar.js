const { ipcMain } = require('electron');

module.exports = (app, mainWindow) => {
  ipcMain.on('quit', () => app.quit());

  ipcMain.on('minimize', () => mainWindow.minimize());
}