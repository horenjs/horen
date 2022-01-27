/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-27 14:17:15
 * @LastEditTime : 2022-01-27 16:10:26
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\store\index.ts
 * @Description  :
 */
import { atom, selector } from 'recoil';
import { Track, Album } from 'types';

export const trackListState = atom({
  key: 'trackListState',
  default: [] as Track[],
});

export const albumListState = selector({
  key: 'albumListState',
  get: ({ get }) => {
    const trackList = get(trackListState);

    const albums: Album[] = [
      {
        name: 'Uncategory',
        children: [],
      },
    ];

    for (const track of trackList) {
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
  },
});
