import React from 'react';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { IoCloseSharp } from 'react-icons/io5';
import { MdAdd, MdOutlineDownloadDone as MdAdded } from 'react-icons/md';
import styled from 'styled-components';

import { Track } from '../../api';
import { AlbumCover } from '../../components/Cover';
import { Album } from './';

const ALBUM_PANEL = styled.div`
  max-height: 400px;
  width: 520px;
  padding: 0 16px 16px 16px;
  position: relative;
  background-repeat: no-repeat;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    z-index: -1;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .background-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-color: #333;
  }
  .header {
    padding: 4px 0;
    color: #939393;
    display: flex;
    align-items: center;
    .spring {
      flex-grow: 1;
    }
    .close-icon {
      display: flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        background-color: #474747;
      }
    }
  }
  .main {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .left {
    width: 40%;
    padding-left: 16px;
    .title {
      color: #d6d6d6;
      padding: 4px;
      text-align: center;
      margin-top: 16px;
    }
    .artist {
      color: #a4a4a4;
      padding: 4px;
      text-align: center;
      font-size: 0.8rem;
    }
    .add-all {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1d1d1d;
      color: #a7a7a7;
      padding: 4px 12px 4px 8px;
      width: fit-content;
      margin: 8px auto;
      cursor: pointer;
      span {
        display: flex;
        align-items: center;
      }
      .add-text {
        position: relative;
        top: -1px;
        user-select: none;
        font-size: 0.8rem;
      }
    }
  }
  .right {
    width: 60%;
    height: 344px;
    padding: 0 16px 0 16px;
    color: #c7c7c7;
    font-size: 0.9rem;
    overflow-y: auto;
    .track-item {
      padding: 4px 0;
      padding-left: 8px;
      padding-right: 4px;
      display: flex;
      align-items: center;
      &.playing {
        background-color: #10b45475;
      }
    }
    .track-title {
      flex-grow: 1;
    }
    .track-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
    }
  }
`;

export default function AlbumPanel({
  album,
  onPlay,
  onPause,
  onAdd,
  onClose,
  onAddAll,
  isPlaying,
  isAdd,
  currentTrack,
}: {
  album: Album;
  onPlay?: (track: Track) => void;
  onPause?: (track: Track) => void;
  onAdd?: (track: Track) => void;
  onAddAll?: (tracks: Track[]) => void;
  onClose?: () => void;
  isPlaying?: boolean;
  isAdd: (track: Track) => boolean;
  currentTrack: Track | null;
}) {
  const isAllAdded = () => {
    for (const track of album.trackList) {
      if (!isAdd(track)) return false;
    }
    return true;
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handlePlay = (track: Track) => {
    if (onPlay) onPlay(track);
  };

  const handlePause = (track: Track) => {
    if (onPause) onPause(track);
  };

  const handleAdd = (track: Track) => {
    if (onAdd) onAdd(track);
  };

  const handleAddAll = (tracks: Track[]) => {
    if (!isAllAdded()) {
      if (onAddAll) onAddAll(tracks);
    }
  };

  return (
    <ALBUM_PANEL className="album-panel">
      <div className="background-mask"></div>
      <div className="background">
        <AlbumCover src={'horen:///' + album.cover} alt="album-background" />
      </div>
      <div className="header">
        <div className="spring"></div>
        <span className="close-icon" onClick={handleClose}>
          <IoCloseSharp />
        </span>
      </div>
      <div className="main">
        <div className="left">
          <AlbumCover
            src={'horen:///' + album.cover}
            alt={album.title + album.artist}
          />
          <div className="title">{album.title}</div>
          <div className="artist">{album.artist}</div>
          <div className="add-all">
            <span>
              {isAllAdded() ? <MdAdded size={20} /> : <MdAdd size={20} />}
            </span>
            <span
              className="add-text"
              onClick={() => handleAddAll(album.trackList)}
            >
              {isAllAdded() ? '已全部添加至播放列表' : '添加所有至播放列表'}
            </span>
          </div>
        </div>
        <div className="right perfect-scrollbar-thin">
          {album.trackList?.map((track) => {
            const isItemPlaying = isPlaying && currentTrack?.uid === track.uid;
            const cls = 'track-item' + (isItemPlaying ? ' playing' : '');
            return (
              <div className={cls} key={track?.uid}>
                <div className="track-title single-line">{track?.title}</div>
                {isItemPlaying ? (
                  <div
                    className="track-icon"
                    onClick={() => handlePause(track)}
                  >
                    <FaPause size={18} />
                  </div>
                ) : (
                  <div className="track-icon" onClick={() => handlePlay(track)}>
                    <FaPlay />
                  </div>
                )}
                <div className="track-icon" onClick={() => handleAdd(track)}>
                  {isAdd(track) ? <MdAdded size={20} /> : <MdAdd size={20} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ALBUM_PANEL>
  );
}
