import React, { useState } from 'react';
import styled from 'styled-components';
import { Album } from '.';
import { refreshCover } from '../../api';
import { AlbumCover } from '../../components/Cover';
import { IoMdRefresh } from 'react-icons/io';

const Item = styled.div`
  height: 188px;
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
    display: flex;
    align-items: center;
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
};

export default function AlbumItem({ album, onOpen, style }: AlbumItemProps) {
  const [key, setKey] = useState(0);
  const handleOpen = () => {
    if (onOpen) onOpen({ ...album });
  };

  const handleFresh = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('从网络获取专辑封面?')) {
      await refreshCover({
        albumName: album.title,
        artistName: album.artist.split(',')[0],
      });
      setKey(new Date().valueOf());
    }
  };

  return (
    <Item key={album.title + album.artist} style={style}>
      <div className="cover" onClick={handleOpen}>
        <AlbumCover
          src={'horen:///' + album.cover}
          alt={album.title + album.artist}
          key={key}
        />
        <span onClick={handleFresh} className="refresh">
          <IoMdRefresh />
        </span>
      </div>
      <div className="albumName single-line">{album.title}</div>
      <div className="artistName">{album.artist}</div>
    </Item>
  );
}
