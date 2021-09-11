const { dialog } = require("electron");
const mm = require("music-metadata");

const musicExtensions = [
  'mp3',
  'mp4',
  'm4a',
  'm4b',
  'aac',
  'flac',
  'ape',
  'wav',
  'ogg',
]

function openFiles(event) {
  dialog.showOpenDialog({
    title: '选择歌曲',
    filters: [
      {
        name: "音乐文件 Musics",
        extensions: musicExtensions,
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