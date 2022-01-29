/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:43
 * @LastEditTime : 2022-01-29 16:29:28
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\types\index.ts
 * @Description  : 
 */
export { Track, Album } from './track';
export { SettingFile, SettingGroup, SettingItem } from './setting';

export interface Page {
  name: string,
  path: string,
  title: string,
}