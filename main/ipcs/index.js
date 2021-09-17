const { ipcMain } = require('electron');
const settingIPC = require('./setting');
const songIPC = require('./song');
const titlebarIPC = require('./titlebar');

function ipcs (app, arg) {
  const { mainWindow } = arg;
  songIPC(mainWindow);
  titlebarIPC(app, mainWindow);
  settingIPC();
}

module.exports = ipcs;