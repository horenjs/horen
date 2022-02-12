/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 19:59:22
 * @LastEditTime : 2022-01-28 23:58:47
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\types\setting.ts
 * @Description  :
 */
export interface SettingFile {
  createAt: string | number;
  updateAt: string | number;
  version: string;
  "common.collectionPaths": string[];
  "common.rebuildWhenStart": boolean;
  "appearance.theme": string;
  "appearance.lang": string;
  [key: string]: string | string[] | number | number[] | boolean;
}

export interface PlayListItem {
  src: string,
  status: 'playing' | 'paused';
}

export interface PlayList {
  createAt: string | number;
  updateAt: string | number;
  version: string;
  title: string;
  name: string;
  children: PlayListItem[];
}
