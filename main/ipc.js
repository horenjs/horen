const { dialog } = require("electron");

function openFiles(event) {
  dialog.showOpenDialog({
    title: '选择歌曲',
    filters: [
      {
        name: "All Files",
        extensions: ['*']
      }
    ],
    properties: ['openFiles', 'multiSelections'],
  }).then(result => {
    event.reply('setting-open-files-reply', result.filePaths)
  }).catch(console.error)
}

module.exports = {
  openFiles
}