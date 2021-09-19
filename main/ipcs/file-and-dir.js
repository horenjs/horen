const { dialog } = require("electron");
const { getMusicMeta } = require('../utils/util');
const { MUSIC_EXTS } = require('../config');

/**
 * open song files
 * @param {Event} event ipcRenderer event
 * @param {object} args args
 */
async function openFiles (event, args) {
  dialog.showOpenDialog({
    title: '选择歌曲',
    filters: [
      {
        name: "音乐文件",
        extensions: MUSIC_EXTS,
      }
    ],
    properties: ['openFiles', 'multiSelections'],
  })
  .then(async result => {
    const fileList = [];

    if (result.canceled) return;

    for (let file of result.filePaths) {
      const metadata = await getMusicMeta(file);
      fileList.push({path:file, ...metadata});
    }

    event.reply("file:open=>reply", fileList);
  })
  .catch(err => {
    console.error(err);
  });
}

module.exports = {
  openFiles,
}