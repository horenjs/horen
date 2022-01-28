/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 01:51:07
 * @LastEditTime : 2022-01-28 22:17:23
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
  track: {
    getListCached: 'track:get-list-cached',
    rebuildCache: 'track:rebuild-list',
    msg: 'track:msg',
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
  // 修改设置时同步修改版本号
  // 以便生成新的设置文件
  version: '0.0.6',
  groups: [
    {
      name: 'common',
      title: '通用选项',
      children: [
        {
          label: 'collectionPaths',
          value: [],
          title: '曲库路径',
        },
      ],
    },
    {
      name: 'apperance',
      title: '外观',
      children: [
        {
          label: 'themeColor',
          value: '',
          title: '主题色',
        },
        {
          label: 'language',
          value: 'Chinese (Simplified)',
          title: '语言',
        },
      ],
    },
    {
      name: 'start',
      title: '启动',
      children: [
        {
          label: 'rebuildWhenStart',
          value: false,
          title: '启动时刷新数据库',
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
    name: 'Library',
    path: '/library',
    title: '音乐库',
  },
  {
    name: 'setting',
    path: '/setting',
    title: '设置',
  },
];

/**
 * 动画持续时长
 */
export const ANIMATION_DELAY = {
  slow: 500,
  normal: 250,
  fast: 100
}
