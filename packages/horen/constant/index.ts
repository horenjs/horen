/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 01:51:07
 * @LastEditTime : 2022-01-30 17:36:28
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\constant\index.ts
 * @Description  :
 */
import { SettingFile, Page } from '../types';
import myapp from '../main/app';

/**
 * ipc 通信使用的信号字符
 */
export const IPC_CODE = {
  track: {
    getListCached: 'track:get-list-cached',
    rebuildCache: 'track:rebuild-list',
    msg: 'track:msg',
    getBySrc: 'track:get-by-uuid',
  },
  setting: {
    get: 'setting:get',
    set: 'setting:set',
  },
  dialog: {
    open: 'dialog:get',
  },
  mainwindow: {
    close: 'mainwindow:close',
    minimize: 'manwindow:mini',
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
  version: '0.0.7',
  playList: [],
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
export const PAGES: Page[] = [
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
  {
    name: 'home',
    path: '/home',
    title: 'test',
  },
];

/**
 * 动画持续时长
 */
export const ANIMATION_DELAY = {
  slow: 500,
  normal: 250,
  fast: 100,
};

/**
 * colors
 */
export const THEME = {
  color: {
    primary: '#4CAF50',
    primaryTint: '#81C784',
    error: '#F44336',
    warning: '#FFC107',
    success: '#4CAF50',
    backgroundColorDeep: '#212529',
    backgroundColor: '#313539',
    backgroundColorTint: '#515557',
    frontColorDeep: 'd1f5f9',
    frontColor: '#f1f5f9',
    frontColorTint: '#fff',
  },
};

export const API_LRC = ['https://music.163.com/api/song/lyric'];
