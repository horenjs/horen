const { ipcMain } = require("electron");
const { readUserData, writeUserData } = require('./app-data');
const { openFiles } = require('./file-and-dir');
const {
  closeMainWindow,
  minimizeMainWindow,
  setMainWindowProgressBar,
  setMainWindowTitle,
} = require('./main-window');

/**
 * handle the ipcMain event together
 * @param {object} args include app, mainWindow, etc..
 */
function ipcs (args) {
  const { app, mainWindow } = args;
  /**
   * userdata
   */
  ipcMain.on('userData:read', (event, args) => readUserData(event, args));
  ipcMain.on('userData:write', (event, args) => writeUserData(event, args));
  /**
   * file and dir
   */
  ipcMain.on('file:open', (event, args) => openFiles(event, args));
  /**
   * main window
   */
  ipcMain.on('mainWindow:close', (event, args) => closeMainWindow(event, args, mainWindow));
  ipcMain.on('mainWindow:minimize', (event, args) => minimizeMainWindow(event, args, mainWindow));
  ipcMain.on('mainWindow:setProgressBar', (event, arg) => setMainWindowProgressBar(event, arg, mainWindow));
  ipcMain.on('mainWindow:setTitle', (event, arg) => setMainWindowTitle(event, arg, mainWindow));
}

module.exports = ipcs;