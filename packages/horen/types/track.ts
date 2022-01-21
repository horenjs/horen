/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:48
 * @LastEditTime : 2022-01-22 02:20:17
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\types\track.ts
 * @Description  :
 */
import { Track as ITrack } from 'horen-plugin-player';

export interface Track extends ITrack {
  src?: string;
  album?: string;
  albumartist?: string;
  date?: string;
  title?: string;
  artist?: string;
  artists?: string[];
  picture?: string;
  track?: {
    no: number;
    of: number;
  };
}
