import {Album, Track} from "types";

/**
 * 对音频列表进行重排并聚合为专辑列表
 * @param tracks 音频列表
 * @returns 重新聚合后的专辑列表
 */
export function aggregateAlbum(tracks: Track[]) {
  const albums: Album[] = [];

  for (const track of tracks) {
    const key = generateAlbumKey(track);
    // 如有没有这个专辑名 则新建一个
    if (!includesAlbum(albums, key)) albums.push({ key });
  }

  return albums;
}

export function generateAlbumKey(t?: Track) {
  if (t?.album) {
    if (t?.artist) return `#${t.album}#@${t.artist}@`;
    else return `#${t.album}#@Unkown@`;
  } else return `#default#@Unkown@`;
}

export function generateTrackTitle(track: Track) {
  return track.title || track.src?.split('\\').pop();
}

export function includesAlbum(albums: Album[], key: string) {
  return albums.filter((album) => album.key === key).length > 0;
}