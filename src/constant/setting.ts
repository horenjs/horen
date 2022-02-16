import {SettingFile} from "../types";

/**
 * 默认设置
 */
export const DEFAULT_SETTING: SettingFile = {
  createAt: new Date().valueOf(),
  updateAt: new Date().valueOf(),
  // 修改设置时同步修改版本号
  // 以便生成新的设置文件
  version: '0.1.1',
  "common.collectionPaths": [],
  "common.rebuildWhenStart": false,
  "common.autoplayWhenStart": true,
  "appearance.theme": 'dark',
  "appearance.lang": 'zh_CN',
};