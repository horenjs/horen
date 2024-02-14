import React, { useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { IoCloseSharp } from 'react-icons/io5';
import { MdAdd, MdOutlineDownloadDone as MdAdded } from 'react-icons/md';
import styled from 'styled-components';
import { TiDeleteOutline } from 'react-icons/ti';

import { Track, fetchCoverFromInternet, writeCoverToFile } from '../../api';
import { AlbumCover } from '../../components/Cover';
import { Album } from './';
import Modal from '../../components/Modal';

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
    .cover {
      position: relative;
      .refresh-cover {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 8px;
        overflow: hidden;
        button {
          background-color: #1d1c1cc0;
          border: none;
          color: #a7a7a7;
          &:hover {
            background-color: #141414ea;
          }
        }
      }
    }
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
      &:hover {
        background-color: #10b45425;
      }
      &.playing {
        background-color: #10b454;
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
  onRefresh,
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
  onRefresh?: () => void;
}) {
  const [coverKey, setCoverKey] = useState(0);

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

  const handleFinish = () => {
    setCoverKey(new Date().valueOf());
    if (onRefresh) onRefresh();
  };

  return (
    <ALBUM_PANEL className="album-panel">
      <div className="background-mask"></div>
      <div className="background">
        <AlbumCover
          src={'horen:///' + album.cover + `?timestamp=${coverKey}`}
          alt="album-background"
        />
      </div>
      <div className="header">
        <div className="spring"></div>
        <span className="close-icon" onClick={handleClose}>
          <IoCloseSharp />
        </span>
      </div>
      <div className="main">
        <div className="left">
          <CoverArea album={album} onFinish={handleFinish} />
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

const CoverSelect = styled.div`
  width: 440px;
  height: 300px;
  padding: 16px;
  background-color: #202020;
  overflow: auto;
  .cover-item {
    display: inline-block;
    vertical-align: middle;
    margin: 4px;
    cursor: pointer;
  }
  img {
    width: 92px;
    height: 92px;
    &:hover {
      opacity: 0.55;
    }
  }
  .no-cover {
    height: 100%;
    width: 100%;
    text-align: center;
    color: #b7b7b7;
  }
`;

const CloseIcon = styled.div`
  color: #7c7c7c;
  text-align: center;
  margin-top: 8px;
`;

function CoverArea({
  album,
  onFinish,
}: {
  album: Album;
  onFinish?: () => void;
}) {
  const [covers, setCovers] = useState<string[] | null>();
  const [albumCoverKey, setAlbumCoverKey] = useState(new Date().valueOf());

  const handleRefresh = async () => {
    setCovers([]);
    const result = await fetchCoverFromInternet({
      albumName: album.title,
      artistName: album.artist,
      type: 10,
    });
    if (result instanceof Array && result.length > 0) {
      const s = result.map((res) => res.picUrl);
      setCovers(s);
    }
  };

  const handleSelectCover = async (url: string) => {
    if (window.confirm('选择当前作为专辑封面?')) {
      setCovers(null);
      await writeCoverToFile(url, album.title + album.artist);
      setAlbumCoverKey(new Date().valueOf());
    }

    if (onFinish) onFinish();
  };

  const handleClose = () => {
    setCovers(null);
  };

  return (
    <div className="cover">
      <AlbumCover
        src={'horen:///' + album.cover + `?timestamp=${albumCoverKey}`}
        alt={album.title + album.artist}
        key={albumCoverKey}
      />
      <div className="refresh-cover">
        <button onClick={handleRefresh}>更换封面</button>
      </div>
      {covers && (
        <Modal>
          <CoverSelect className="perfect-scrollbar">
            {covers.length > 0 ? (
              covers.map((cover) => (
                <div
                  key={cover}
                  className="cover-item"
                  onClick={() => handleSelectCover(cover)}
                >
                  <img alt={cover} src={cover} />
                </div>
              ))
            ) : (
              <div className="no-cover">无法获取该专辑封面</div>
            )}
          </CoverSelect>
          <CloseIcon onClick={handleClose}>
            <TiDeleteOutline size={32} />
          </CloseIcon>
        </Modal>
      )}
    </div>
  );
}
