/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-27 16:13:47
 * @LastEditTime : 2022-01-27 21:26:58
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\store\state.ts
 * @Description  :
 */
import { atom, selector } from 'recoil';
import { Track, Album, SettingFile } from 'types';

/**
 * 曲库中存在的所有音频列表
 */
export const trackListState = atom({
  key: 'trackListState',
  default: [] as Track[],
});

/**
 * 在队列中的音频列表
 */
export const tracksInQueueState = atom({
  key: 'tracksInQueue',
  default: [] as Track[],
});

/**
 * 专辑列表
 */
export const albumListState = atom({
  key: 'albumListState',
  default: [] as Album[],
});

/**
 * 存储在 json 文件中的设置项
 */
export const settingState = atom({
  key: 'settingState',
  default: {} as SettingFile,
});
