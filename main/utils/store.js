const fs = require('fs');
const _ = require('lodash');
const { getMusicMeta } = require('./util');
const { USER_CONFIG_PATH, DEFAULT_CONFIG_PATH } = require('../config');

/**
 * save play state to config
 * @param {Array<song>} songList song list
 */
function saveConfig(songList) {
  fs.readFile(DEFAULT_CONFIG_PATH, (err, data) => {
    if (!err) {
      let defaultConfig = JSON.parse(data);

      // 转化 封面的 unit8array 为 base64 格式的字符串
      defaultConfig["songList"] = songList.map(f => ({path: f.path}));

      // 写入配置文件
      fs.writeFile(USER_CONFIG_PATH, JSON.stringify(defaultConfig), (e, d) => {
        if (!e) {
          console.log('write config success');
        } else {
          console.log(e);
        }
      })
    }
  })
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

            const songList = appConfig.songList;
            const finalSongList = [];

            for (let i = 0; i < songList.length; i ++) {
              const p = songList[i].path;
              const metaData = await getMusicMeta(p);
              finalSongList.push({path: p, ...metaData});
            }

            appConfig.songList = finalSongList;

            resolve(appConfig);
          } else {
            reject(e);
          }
        })
      }
    }) 
  });
}

module.exports = {
  saveConfig,
  readConfig,
};