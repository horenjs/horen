/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-15 14:03:05
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \MintForge\packages\mintin-alo\types\index.ts
 * @Description  : 
 */
export interface ISong {
  path?: string,
  album?: string,
  albumartist?: string,
  date?: string,
  title?: string,
  artist?: string,
  artists?: string[],
  picture?: string,
  track?: {
    no: number,
    of: number,
  }
  prev?: ISong,
  next?: ISong,
}