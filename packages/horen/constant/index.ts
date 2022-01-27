/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 01:51:07
 * @LastEditTime : 2022-01-27 20:51:08
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\constant\index.ts
 * @Description  :
 */
import { SettingFile } from '../types';
import myapp from '../main/app';

/**
 * ipc 通信使用的信号字符
 */
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
    open: 'dialog:get',
  },
};

/**
 * 用户目录
 */
export const APP_DATA_PATH =
  process.env.APPDATA || myapp.app.getPath('appData') || '.';

/**
 * 应用名
 * todo: 应当从 package.json 读取
 */
export const APP_NAME = 'horen';

/**
 * 默认设置
 */
export const DEFAULT_SETTING: SettingFile = {
  createAt: new Date().valueOf(),
  updateAt: new Date().valueOf(),
  version: '0.0.3',
  groups: [
    {
      name: 'common',
      children: [
        {
          label: 'collectionPaths',
          value: [],
        },
        {
          label: 'refreshWhenOpen',
          value: true,
        },
      ],
    },
  ],
};

/**
 * 可以解析的音频文件格式
 */
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

/**
 * 页面
 */
export const PAGES = [
  {
    title: 'Library',
    path: '/library',
  },
  {
    title: 'setting',
    path: '/setting',
  },
];
