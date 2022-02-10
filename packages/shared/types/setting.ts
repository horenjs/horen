/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 19:59:22
 * @LastEditTime : 2022-01-28 23:58:47
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\types\setting.ts
 * @Description  :
 */
export type SettingItemValue = string | boolean | number | string[] | number[];

export interface SettingItem {
  label: string;
  value: SettingItemValue;
  title: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SettingGroup {
  name: string;
  children: SettingItem[];
  title: string,
}

export interface SettingFile {
  createAt: string | number;
  updateAt: string | number;
  version: string;
  groups: SettingGroup[];
  playList: string[];
}
