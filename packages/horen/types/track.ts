/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:48
 * @LastEditTime : 2022-01-26 11:50:06
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\types\track.ts
 * @Description  :
 */
import {
  ITrackInfo,
  ICommonTagsResult,
  INativeTags,
  IFormat,
} from 'music-metadata/lib/type';
import { Track as ITrack } from 'horen-plugin-player'

export type MyDate = string | number | Date;

export interface Base {
  createAt?: MyDate;
  updateAt?: MyDate;
  modifiedAt?: MyDate;
}

export interface MyTrack extends Base {
  common?: ICommonTagsResult;
  format?: IFormat;
  trackInfo?: ITrackInfo;
  native?: INativeTags;
}

export type Track = MyTrack & ITrack;
