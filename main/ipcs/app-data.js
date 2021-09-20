const fs = require('fs');
const _ = require('lodash');
const { getMusicMeta } = require('../utils/util');
const { USER_CONFIG_PATH, DEFAULT_CONFIG_PATH } = require('../config');

/**
 * read user data
 * @param {Event} event ipcRenderer event
 * @param {object} args args 
 */
async function readUserData (event, args) {
  const appConfig = await readConfig();
  // console.log(appConfig);
  event.reply('userData:read=>reply', appConfig);
}

/**
 * write user data
 * @param {Event} event ipcRenderer event
 * @param {object} args args
 */
async function writeUserData (event, args) {
  await saveConfig(args);
  event.reply('userData:write=>reply', {message: 'write user data success', code: 1});
}

/**
 * read the app config
 * @returns app config
 */
async function readConfig() {
  return new Promise(async (resolve, reject) => {
    fs.readFile(DEFAULT_CONFIG_PATH, (err, data) => {
      if (!err) {
        fs.readFile(USER_CONFIG_PATH, async (e, d) => {
          if (!e) {
            const defaultConfig = JSON.parse(data);
            const userConfig = JSON.parse(d);

            let appConfig = _.merge(defaultConfig, userConfig);

            const { songList, playHistory, currentSong } = appConfig;

            if (songList) {
              // 因为只保留了文件路径，读取时要复原完整
              const finalSongList = [];

              for (let i = 0; i < songList.length; i ++) {
                const p = songList[i].path;
                const metaData = await getMusicMeta(p);
                finalSongList.push({path: p, ...metaData});
              }

              appConfig.songList = finalSongList;
            }

            if (playHistory) {
              const finalHistory = [];

              for (let i = 0; i < playHistory.length; i ++) {
                const p = playHistory[i].path;
                const metaData = await getMusicMeta(p);
                finalHistory.push({path: p, ...metaData});
              }

              appConfig.playHistory = finalHistory;
            }

            if (currentSong) {
              const metaData = await getMusicMeta(currentSong.path);
              appConfig.currentSong = {
                path: currentSong.path,
                ...metaData
              }
            }

            resolve(appConfig);
          } else {
            reject(e);
          }
        })
      }
    }) 
  });
}

/**
 * save play state to config
 * @param {Array} songList song list
 */
async function saveConfig(currentStatus) {
  // console.log(currentStatus);

  const appConfig = await readConfig();

  const finalConfig = _.merge(appConfig, currentStatus);

  // console.log(finalConfig);

  // 歌曲、历史播放列表，只保留文件路径
  const { songList, playHistory, currentSong, } = finalConfig;

  if (songList) {
    finalConfig.songList = songList.map(s => ({path: s.path}));
  }

  if (playHistory) {
    finalConfig.playHistory = playHistory.map(s => ({path: s.path}));
  }

  if (currentSong) {
    finalConfig.currentSong = {path: currentSong.path};
  }

  console.log(finalConfig);

  // 写入配置文件
  fs.writeFile(USER_CONFIG_PATH, JSON.stringify(finalConfig, null, 2), (e) => {
    if (!e) {
      console.log('write config success');
    } else {
      console.log(e);
    }
  })
}

module.exports = {
  readUserData,
  writeUserData,
};