import React from 'react';
import styled from 'styled-components';
import { ISong } from '@/types';

import DoubleRight from '@/assets/icons/double-right.svg';

const Container = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  background-color: #f4f4f4;
  .close-list {
    width: 24px;
    height: 100%;
    padding: 0 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #ececec;
    }
  }
  .inner {
    height: 272px;
    width: 100%;
    margin-top: 28px;
    overflow-y: scroll;
  }
`;

const SongListItem = styled.div`
  position: relative;
  font-size: 14px;
  padding: 4px 16px;
  cursor: pointer;
  border-radius: 4px;
  &.current-song {
    background-color: #D5F5E3;
    color: #777;
  }
  &:after {
    position: absolute;
    bottom: -2px;
    left: 0;
    content: ' ';
    width: 248px;
    height: 2px;
    margin-left: 8px;
    border-top: 2px solid #82E0AA;
    visibility: hidden;
  }
  &:hover {
    background-color: #ABEBC6;
    color: #777;
  }
  .item-line {
    margin: 4px 0;
    &.more-info {
      font-size: 0.7rem;
      color: #999;
    }
  }
`;

interface IProps {
  songs: ISong[],
  currentSong: ISong,
  onClose: React.MouseEventHandler<HTMLElement>,
  onSelect: (e: React.MouseEvent<HTMLElement>, s: ISong) => void,
  onDoubleSelect: (e: React.MouseEvent<HTMLElement>, s: ISong) => void,
}

export default function (props: IProps) :React.ReactElement {
  const { songs, currentSong, onClose, onSelect, onDoubleSelect } = props;

  const renderItem = (s: ISong, index: number) => {
    let classname = '';
    
    // console.log(s, currentSong);

    if (currentSong) {
      if (s.path === currentSong.path) {
        classname = 'current-song';
      }
    }

    return (
      <SongListItem
        onClick={e => onSelect(e, s)}
        onDoubleClick={e => onDoubleSelect(e, s)}
        key={index}
        className={classname}
      >
        <div className="item-line">
          <span>{ s.common.artist }</span>
          <span> - </span>
          <span>{ s.common.title }</span>
        </div>
        <div className="item-line more-info">
          <span>{ s.common.album }</span>
          <span style={{marginLeft: 8}}>
            { s.common.track.no + ' / ' + s.common.track.of }
          </span>
        </div>
      </SongListItem>
    )
  }

  return (
    <Container className="list no-drag">
      <div className="close-list" onClick={onClose}>
        <img src={DoubleRight} alt='close-list' style={{marginBottom:16}} />
      </div>
      {
        songs.length
          ?
          <div className="inner custom-scrollbar">
            { songs.map(renderItem) }
          </div>
          :
          <div className="inner" style={{textAlign:'center'}}>
            No Songs
          </div>
      }
    </Container>
  );
}
