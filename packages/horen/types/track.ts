/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:48
 * @LastEditTime : 2022-01-29 22:45:53
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
  uuid?: string;
  date?: MyDate;
  picture?: string;
  common?: ICommonTagsResult;
  format?: IFormat;
  trackInfo?: ITrackInfo;
  year?: number | string,
  genre?: string,
  native?: INativeTags;
  duration?: number;
  playStatus?: 'in-queue' | 'playing' | 'paused' | 'stop';
  md5?: string;
}

export interface Album {
  name: string;
  children: Track[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type Track = MyTrack & ITrack;
