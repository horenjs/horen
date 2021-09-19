/**
 * handle event: close the main window (quit)
 * @param {Event} event the ipcRenderer event
 * @param {object} args args
 * @param {object} mainWindow main window
 */
async function closeMainWindow (event, args, mainWindow) {
  mainWindow.close();
  // event.reply('mainWindow:close=>reply', 'main window has been closed.');
}

/**
 * handle event: minimize the mian window
 * @param {Event} event ipcRenderer Event
 * @param {object} args args
 * @param {object} mainWindow main window
 */
async function minimizeMainWindow (event, args, mainWindow) {
  mainWindow.minimize();
  // event.reply('mainWindow:minimize=>reply', 'main window has been minimized.')
}

/**
 * handle event: set the main window progress bar
 * @param {Event} event ipc renderer event
 * @param {number} arg progress (0-100)
 * @param {object} mainWindow main window
 */
function setMainWindowProgressBar (event, arg, mainWindow) {
  const progress = arg / 100;
  // console.log('current progress:', progress);
  mainWindow.setProgressBar(progress);
  // event.reply('mainWindow:setProgressBar=>reply', `current progress: ${progress}`);
}

/**
 * handle event: set the main window title
 * @param {Event} event ipcRender event
 * @param {string} arg title
 * @param {object} mainWindow main window
 */
function setMainWindowTitle (event, arg, mainWindow) {
  mainWindow.setTitle(arg);
  // event.reply('mainWindow:setTitle=>reply', `current title: ${arg}`);
}

module.exports = {
  closeMainWindow,
  minimizeMainWindow,
  setMainWindowProgressBar,
  setMainWindowTitle,
}