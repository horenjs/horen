const { dialog } = require("electron");
const mm = require("music-metadata");

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
  }).then(async result => {
    const fileList = [];
    for (let file of result.filePaths) {
      const metadata = await musicMeta(file);
      fileList.push({path:file, ...metadata});
    }
    event.reply("setting-open-files-reply", fileList);
  }).catch(console.error)
}

async function musicMeta(fileName) {
  try {
    const metadata = await mm.parseFile(fileName);
    return metadata;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  openFiles
}