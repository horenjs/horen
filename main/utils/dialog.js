const { dialog } = require("electron");
const { getMusicMeta } = require('./util');
const { MUSIC_EXTS } = require('../config');

/**
 * select song files
 * @param {Event} event ipc event
 */
function selectFiles() {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({
      title: '选择歌曲',
      filters: [
        {
          name: "音乐文件 Musics",
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
  
      resolve(fileList);
    })
    .catch(err => {
      reject(err);
    });
  })
}

module.exports = {
  selectFiles,
}