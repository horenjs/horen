export interface ISong {
  title: string,
  singer: string,
  path: string,
  prev?: ISong,
  next?: ISong,
}