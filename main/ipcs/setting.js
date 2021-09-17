const { ipcMain } = require('electron');
const { selectFiles } = require('../utils/dialog');

module.exports = () => {
  /**
   * setting events
   */
  ipcMain.on('setting:open-files', async (event) => {
    const songList = await selectFiles();
    event.reply("setting-reply:open-files", songList);
  });
}