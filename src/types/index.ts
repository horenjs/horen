/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:43
 * @LastEditTime : 2022-02-01 16:23:14
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\types\lyric.util.ts
 * @Description  : 
 */
export { Track, Album, LyricScript, MyDate, PlayOrder } from './track';
export { SettingFile, PlayList, PlayListItem } from './setting';

export interface Page {
  name: string,
  path: string,
  title: string,
}

export type Code =
  | 1
  | 0

export interface Resp<T = object | object[] | string | number | string[] | number[]> {
  code: Code;
  msg: string;
  data: T;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
