/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 22:24:48
 * @LastEditTime : 2022-01-21 22:24:49
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\types\song.ts
 * @Description  :
 */
export interface Track {
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
