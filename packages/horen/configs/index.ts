/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 01:51:07
 * @LastEditTime : 2022-01-25 23:06:46
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\configs\index.ts
 * @Description  :
 */
import { SettingFile } from '../types';

export const IPC_CODE = {
  file: {
    getList: 'file:getList',
    get: 'file:get',
  },
  setting: {
    get: 'setting:get',
    set: 'setting:set',
  },
  dialog: {
    open: 'dialog:get'
  }
};

export const APP_DATA_PATH = process.env.APPDATA || '.';

export const APP_NAME = 'horen';

export const DEFAULT_SETTING: SettingFile = {
  createAt: new Date().valueOf(),
  updateAt: new Date().valueOf(),
  version: '0.0.2',
  grounps: [
    {
      name: 'common',
      children: [
        {
          label: 'collectionPaths',
          value: []
        },
        {
          label: 'refreshWhenOpen',
          value: true,
        }
      ]
    }
  ]
}

export const TRACK_FORMAT = [
  'aiff',
  'aac',
  'ape',
  'asf',
  'dsdiff',
  'dsf',
  'flac',
  'mp2',
  'mka',
  'mkv',
  'mp3',
  'mpc',
  'mp4',
  'm4a',
  'm4v',
  'ogg',
  'opus',
  'speex',
  'theora',
  'vorbis',
  'wav',
  'webm',
  'wv',
  'wma',
];
