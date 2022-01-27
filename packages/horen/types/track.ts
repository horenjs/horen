/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:48
 * @LastEditTime : 2022-01-27 21:16:56
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\types\track.ts
 * @Description  :
 */
import {
  ITrackInfo,
  ICommonTagsResult,
  INativeTags,
  IFormat,
} from 'music-metadata/lib/type';
import { Track as ITrack } from 'horen-plugin-player';

export type MyDate = string | number | Date;

export interface Base {
  createAt?: MyDate;
  updateAt?: MyDate;
  modifiedAt?: MyDate;
}

export interface MyTrack extends Base {
  date?: MyDate;
  picture?: string;
  common?: ICommonTagsResult;
  format?: IFormat;
  trackInfo?: ITrackInfo;
  native?: INativeTags;
  playStatus?: 'in-queue' | 'playing' | 'paused' | 'stop'
}

export interface Album {
  name: string;
  children: Track[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type Track = MyTrack & ITrack;
