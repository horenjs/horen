import React from 'react';
import { Track } from '../../api';
import { AlbumCover } from '../../components/Cover';
import { GrLinkTop } from 'react-icons/gr';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { IoCloseSharp } from 'react-icons/io5';
import { normalizeDuration } from '../../utils';
import styled from 'styled-components';

const Item = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px 0 0;

  &:nth-child(2n) {
    background-color: #3a3a3a6d;
  }
  &:hover {
    background-color: #10b45425;
  }
  &:hover {
    .to-top {
      visibility: visible;
    }
    .play-or-pause {
      visibility: visible;
    }
    .delete {
      visibility: visible;
    }
  }
  &.playing {
    background-color: #10b45475;
  }
`;

const TitleInfo = styled.div`
  max-height: 80px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  flex-grow: 1;
  .trackTitle-title {
    font-size: 0.9rem;
    color: #d4d4d4;
  }
  .trackTitle-artist {
    font-size: 0.8rem;
    color: #aaa;
    font-weight: 300;
  }
  .cover-thumbnail {
    height: 44px;
    width: 44px;
    margin-right: 12px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .to-top {
    visibility: hidden;
    margin-right: 24px;
    display: flex;
    align-items: center;
    color: #aaa;
  }
  .play-or-pause {
    visibility: hidden;
    margin-right: 16px;
    user-select: none;
    color: #aaa;
    span {
      display: flex;
      align-items: center;
    }
  }
  .delete {
    visibility: hidden;
    user-select: none;
    margin-right: 32px;
    display: flex;
    align-items: center;
    color: #c50d0d;
  }
`;

const AlbumTitle = styled.div`
  width: 200px;
  color: #cdcdcd;
  font-weight: 300;
  font-size: 0.8rem;
`;

const DurationTime = styled.div`
  color: #cdcdcd;
  width: 100px;
  text-align: right;
`;

export default function PlayListItem({
  track,
  onPlay,
  onPause,
  onDel,
  isPlaying,
  style,
}: {
  track: Track;
  onPlay: (track: Track) => void;
  onPause: (track: Track) => void;
  onDel: (track: Track) => void;
  isPlaying: boolean;
  style: React.CSSProperties;
}) {
  const handlePlay = () => {
    if (onPlay) onPlay(track);
  };

  const handlePause = () => {
    if (onPause) onPause(track);
  };

  const handleDel = (track: Track) => {
    if (onDel) onDel(track);
  };

  const cls = 'play-list-item' + (isPlaying ? ' playing' : '');

  return (
    <Item className={cls} style={style}>
      <TitleInfo className="trackTitle">
        <div className="cover-thumbnail">
          <AlbumCover src={'horen:///' + track.cover} alt={track.title} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <div className="trackTitle-title">{track.title}</div>
          <div className="trackTitle-artist">{track.artist}</div>
        </div>
        <div className="to-top">
          <GrLinkTop />
        </div>
        <div className="play-or-pause">
          {isPlaying ? (
            <span onClick={handlePause}>
              <FaPause size={16} />
            </span>
          ) : (
            <span onClick={handlePlay}>
              <FaPlay size={16} />
            </span>
          )}
        </div>
        <div className="delete" onClick={() => handleDel(track)}>
          <IoCloseSharp size={22} />
        </div>
      </TitleInfo>
      <AlbumTitle className="album">{track.album}</AlbumTitle>
      <DurationTime className="duration">
        {track.duration && normalizeDuration(track.duration)}
      </DurationTime>
    </Item>
  );
}
