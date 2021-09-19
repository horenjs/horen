const fs = require('fs');
const _ = require('lodash');
const { getMusicMeta } = require('./util');
const { USER_CONFIG_PATH, DEFAULT_CONFIG_PATH } = require('../config');

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

            const songList = appConfig.songList;
            const playHistory = appConfig.playHistory;

            const finalSongList = [];
            const finalHistory = [];

            for (let i = 0; i < songList.length; i ++) {
              const p = songList[i].path;
              const metaData = await getMusicMeta(p);
              finalSongList.push({path: p, ...metaData});
            }

            for (let i = 0; i < playHistory.length; i ++) {
              const p = playHistory[i].path;
              const metaData = await getMusicMeta(p);
              finalHistory.push({path: p, ...metaData});
            }

            appConfig.songList = finalSongList;
            appConfig.playHistory = finalHistory;

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
 * @param {Array<song>} songList song list
 */
async function saveConfig(currentStatus) {
  // console.log(currentStatus);

  const appConfig = await readConfig();

  if ('songList' in appConfig && 'playHistory' in appConfig) {
    appConfig.songList = appConfig.songList.map(s => ({path: s.path}));
    appConfig.playHistory = appConfig.playHistory.map(p => ({path: p.path}));
  }

  const finalConfig = _.merge(appConfig, currentStatus);

  // console.log(finalConfig);
  // 写入配置文件
  fs.writeFile(USER_CONFIG_PATH, JSON.stringify(finalConfig), (e) => {
    if (!e) {
      console.log('write config success');
    } else {
      console.log(e);
    }
  })
}

module.exports = {
  saveConfig,
  readConfig,
};