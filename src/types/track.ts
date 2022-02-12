/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:48
 * @LastEditTime : 2022-02-01 16:21:36
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\types\track.ts
 * @Description  :
 */
import {
  ITrackInfo,
  ICommonTagsResult,
  INativeTags,
  IFormat,
} from 'music-metadata/lib/type';

export type MyDate = string | number | Date;

export interface Base {
  createAt?: MyDate;
  updateAt?: MyDate;
  modifiedAt?: MyDate;
}

export interface Track extends Base {
  uuid?: string;
  date?: MyDate;
  picture?: string;
  year?: number | string;
  genre?: string;
  duration?: number;
  src?: string;
  title?: string;
  artist?: string;
  artistList?: string[];
  album?: string;
  common?: ICommonTagsResult;
  format?: IFormat;
  trackInfo?: ITrackInfo;
  native?: INativeTags;
  playStatus?: 'in-queue' | 'playing' | 'paused' | 'stop';
  md5?: string;
}

export interface Album {
  name: string;
  children: Track[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type LyricScript = {
  start: number;
  text: string;
  end: number;
};
