/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 12:50:22
 * @LastEditTime : 2022-01-28 11:17:45
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\pages\library\album-viewer.tsx
 * @Description  : 
 */
import React from 'react';
import { Album } from 'types';
import defaultCover from '@/static/image/default-cover';

interface Props {
  album: Album;
  onOpen(album: Album): void;
}

export function AlbumView(props: Props) {
  const { album, onOpen } = props;

  const src = album.children[0]?.picture || defaultCover;

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>, a: Album) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen(a);
  };

  if (album.children.length < 1) return <></>;

  return (
    <div
      className="album"
      key={album.name}
      onClick={(e) => handleOpen(e, album)}
    >
      <img src={`data:image/png;base64,${src}`} alt={album.name} />
      <div className="info">
        <div className="name">{album.name}</div>
        <div className='track-count'>{album.children.length} 首歌曲</div>
        <div className="artist">{album.children[0].artist}</div>
      </div>
    </div>
  );
}
