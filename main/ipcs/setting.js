const { ipcMain } = require('electron');
const { selectFiles } = require('../utils/dialog');
const { saveConfig } = require('../utils/store');

module.exports = () => {
  /**
   * setting events
   */
  ipcMain.on('setting-open-files', async (event) => {
    const songList = await selectFiles();
    event.reply("setting-open-files-reply", songList);
    saveConfig(songList);
  });
}