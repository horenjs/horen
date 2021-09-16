export interface ISong {
  id: number,
  uid: string,
  path?: string,
  common?: {
    album?: string,
    albumartist: string,
    date?: string,
    title?: string,
    artist?: string,
    picture: {
      format: string,
      data: Buffer,
      description?: string,
      type?: string,
    }[],
    track?: {
      no: number,
      of: number,
    }
  },
  prev?: ISong,
  next?: ISong,
}