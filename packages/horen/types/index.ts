/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:43
 * @LastEditTime : 2022-01-30 15:36:39
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\types\index.ts
 * @Description  : 
 */
export { Track, Album, Lyric } from './track';
export { SettingFile, SettingGroup, SettingItem } from './setting';

export interface Page {
  name: string,
  path: string,
  title: string,
}
