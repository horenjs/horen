const { dialog } = require("electron");
const mm = require("music-metadata");
const fs = require('fs');
const path = require('path');

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

    const configPath = path.resolve(__dirname, '../public/config.user.json');

    let defaultConfig;
    fs.readFile(path.resolve(__dirname, '../public/config.json'), (err, data) => {
      if (!err) {
        defaultConfig = JSON.parse(data);
        defaultConfig["songList"] = fileList.map(f => {
          f.common.picture[0].data = arrayBufferToBase64(f.common.picture[0].data);
          return f;
        });
        fs.writeFile(configPath, JSON.stringify(defaultConfig), (e, d) => {
          if (!e) {
            console.log('write config success');
          }
        })
      }
    })

    event.reply("setting-open-files-reply", fileList);
  }).catch(console.error)
}

async function musicMeta(fileName) {
  const metadata = mm.parseFile(fileName);
  return metadata;
}

function arrayBufferToBase64(array) {
  array = new Uint8Array(array);
  var length = array.byteLength;
  var table = ['A','B','C','D','E','F','G','H',
               'I','J','K','L','M','N','O','P',
               'Q','R','S','T','U','V','W','X',
               'Y','Z','a','b','c','d','e','f',
               'g','h','i','j','k','l','m','n',
               'o','p','q','r','s','t','u','v',
               'w','x','y','z','0','1','2','3',
               '4','5','6','7','8','9','+','/'];
  var base64Str = '';
  for(var i = 0; length - i >= 3; i += 3) {
      var num1 = array[i];
      var num2 = array[i + 1];
      var num3 = array[i + 2];
      base64Str += table[num1 >>> 2]
          + table[((num1 & 0b11) << 4) | (num2 >>> 4)]
          + table[((num2 & 0b1111) << 2) | (num3 >>> 6)]
          + table[num3 & 0b111111];
  }
  var lastByte = length - i;
  if(lastByte === 1) {
      var lastNum1 = array[i];
      base64Str += table[lastNum1 >>> 2] + table[((lastNum1 & 0b11) << 4)] + '==';
  } else if(lastByte === 2){
      var lastNum1 = array[i];
      var lastNum2 = array[i + 1];
      base64Str += table[lastNum1 >>> 2]
          + table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)]
          + table[(lastNum2 & 0b1111) << 2]
          + '=';
  }
  return base64Str;
}

module.exports = {
  openFiles,
  arrayBufferToBase64
}