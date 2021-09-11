export interface ISong {
  path?: string,
  common?: {
    title?: string,
    artist?: string,
    picture: {
      format: string,
      data: Buffer,
      description?: string,
      type?: string,
    }[],
  },
  prev?: ISong,
  next?: ISong,
}