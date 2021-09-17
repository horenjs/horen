const { ipcMain } = require('electron');
const { saveConfig } = require('../utils/store');

module.exports = (app, mainWindow) => {
  ipcMain.on('quit', async (event, args) => {
    const { status } = args;
    const { songList } = status;

    if (songList) {
      status.songList = songList.map(s => ({path: s.path}));
      await saveConfig(status);
    }

    event.reply('quit-reply', 'quited');
    app.quit();
  });

  ipcMain.on('minimize', () => mainWindow.minimize());
}