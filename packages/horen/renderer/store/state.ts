/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-27 16:13:47
 * @LastEditTime : 2022-01-27 21:03:36
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\store\state.ts
 * @Description  :
 */
import { atom, selector } from 'recoil';
import { Track, Album, SettingFile } from 'types';

/**
 * 曲库中存在的所有音频列表
 */
export const trackListState = atom({
  key: 'trackListState',
  default: [] as Track[],
});

/**
 * 专辑列表
 */
export const albumListState = selector({
  key: 'albumListState',
  get: ({ get }) => {
    const trackList = get(trackListState);
    return aggregateAlbum(trackList);
  },
});

/**
 * 存储在 json 文件中的设置项
 */
export const settingState = atom({
  key: 'settingState',
  default: {} as SettingFile,
})

/**
 * 对音频列表进行重排并聚合为专辑列表
 * @param tracks 音频列表
 * @returns 重新聚合后的专辑列表
 */
function aggregateAlbum(tracks: Track[]) {
  const albums: Album[] = [
    {
      name: 'Uncategory',
      children: [],
    },
  ];

  for (const track of tracks) {
    const title = track.title || track.src?.split('\\').pop();

    const newTrack: Track = { ...track, title };

    if (track.album) {
      // 遍历暂时存放专辑的列表与传入的专辑进行对比
      const hits = albums.filter((album) => album.name === track.album);
      // 如果暂存列表中有这个专辑名 就将这个 Track push 到第一个匹配的专辑
      if (hits.length) hits[0].children.push(newTrack);
      // 如有没有这个专辑名 则新建一个
      else albums.push({ name: track.album, children: [newTrack] });
    } else {
      // 如果专辑名为空 则传入 Uncategory 专辑
      albums[0].children.push(newTrack);
    }
  }

  return albums;
}
