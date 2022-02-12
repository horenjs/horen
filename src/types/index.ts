/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:43
 * @LastEditTime : 2022-02-01 16:23:14
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\types\lyric.ts
 * @Description  : 
 */
export { Track, Album, LyricScript, MyDate } from './track';
export { SettingFile, PlayList, PlayListItem } from './setting';

export interface Page {
  name: string,
  path: string,
  title: string,
}
