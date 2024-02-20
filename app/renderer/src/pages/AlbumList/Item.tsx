import React from 'react';
import styled from 'styled-components';

import { AlbumCover } from '../../components/Cover';
import { Album } from './';

const Item = styled.div`
  height: 188px;
  width: 132px;
  margin: 8px;
  list-style: none;
  cursor: pointer;
  img {
    width: 100%;
    height: 132px;
    margin-bottom: 4px;
    object-fit: cover;
  }
  .albumName {
    padding: 0 4px;
    font-size: 0.9rem;
    color: #f1f1f1;
    width: 100%;
    height: 20px;
    overflow: hidden;
  }
  .artistName {
    padding: 0 4px;
    margin-top: 4px;
    height: 18px;
    overflow: hidden;
    font-size: 0.8rem;
    font-weight: 300;
    color: #969696;
  }
  .cover {
    position: relative;
    &:hover {
      .refresh {
        visibility: visible;
      }
    }
  }
  .refresh {
    position: absolute;
    left: 4px;
    bottom: 8px;
    color: #8b8b8b;
    visibility: hidden;
    cursor: pointer;
  }
`;

export type AlbumItemProps = {
  album: Album;
  onOpen?: (album: Album) => void;
  style?: React.CSSProperties;
  coverKey: string | number;
};

export default function AlbumItem({
  album,
  onOpen,
  style,
  coverKey,
}: AlbumItemProps) {
  const handleOpen = () => {
    if (onOpen) onOpen({ ...album });
  };

  return (
    <Item key={album.title + album.artist} style={style}>
      <div className="cover" onClick={handleOpen}>
        <AlbumCover
          src={'horen:///' + album.cover + `?timestamp=${coverKey}`}
          alt={album.title + album.artist}
          key={coverKey}
        />
      </div>
      <div className="albumName single-line" title={album.title}>
        {album.title}
      </div>
      <div className="artistName">{album.artist}</div>
    </Item>
  );
}
