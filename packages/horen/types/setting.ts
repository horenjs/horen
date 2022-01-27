/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 19:59:22
 * @LastEditTime : 2022-01-27 22:14:36
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
  version: string,
  groups: SettingGroup[];
}
