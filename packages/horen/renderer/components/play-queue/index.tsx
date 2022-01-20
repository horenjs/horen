/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 16:24:28
 * @LastEditTime : 2022-01-21 00:25:16
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \alo\packages\alo\renderer\components\play-queue\index.tsx
 * @Description  : 右侧滑出的歌曲列表
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { ISong } from '../../../../../src/types';

interface PlaylistProps {
  songs: ISong[],
  visible: boolean,
  playing: ISong,
  onPlay(e: React.MouseEvent<HTMLElement>, i: number): void;
  onClose(): void;
}

const MyPlayQueue = styled.div`
  width: 320px;
  height: 100vh;
  padding: 32px 0 0 0;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  background-color: #414243;
  color: #f1f1f1;
  
  &.slideOutRight {
    animation: slideOutRight .25s;
    animation-fill-mode: forwards;
  }
  &.slideInRight {
    animation: slideInRight .25s;
    animation-fill-mode: forwards;
  }
  .header {
    font-size: 1.3rem;
    padding: 0 32px;
    .count {
      font-size: 0.8rem;
      padding: 8px 0;
    }
  }
  .queue {
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #777;
    }
    padding: 16px 0;
    height: calc(100vh - 220px);
    overflow-y: auto;
    .queue-item {
      padding: 8px 32px;
      cursor: pointer;
      &:hover {
        background-color: #555;
      }
      .info {
        .title {
          font-size: 1rem;
        }
        .artist {
          font-size: 0.8rem;
          color: #999;
          margin-top: 4px;
        }
      }
    }
  }
  .bottom {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 80px;
    padding: 0 32px;
    background-color: #414243;
    .close {
      height: 60px;
      text-align: center;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      &:hover {
        background-color: #515253;
      }
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(100%, 0, 0);
    }
  }
  @keyframes slideInRight {
    from {
      transform: translate3d(100%, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
`;

const PlayQueue: React.FC<PlaylistProps> = (props) => {
  const { songs, visible, playing, onPlay, onClose } = props;

  const handlePlay = (e: React.MouseEvent<HTMLElement>, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay(e, i);
  }

  const renderItem = (item: ISong, index: number) => {
    const isPlaying = item?.title === playing?.title;

    return (
      <div
        className="queue-item"
        onClick={(e) => handlePlay(e, index)}
        key={item.path}
      >
        <div className="info">
          <div
            className="title"
            style={{ color: isPlaying ? "#1ece9d" : "#fcfcfc" }}
          >
            {item.title || "Unkown Song"}
          </div>
          <div
            className="artist"
            style={{ color: isPlaying ? "#1ece9d" : "#aaa" }}
          >
            {item.artist || "Unkown Artist"}
          </div>
        </div>
        <div className="operate"></div>
      </div>
    );
  }

  return ReactDOM.createPortal(
    <MyPlayQueue
      className={`component-playlist ${
        visible ? "slideInRight" : "slideOutRight"
      }`}
    >
      <div className="header">
        <div className="title">播放队列</div>
        <div className="count">{songs?.length} 首歌曲</div>
      </div>
      <div className="queue">{songs && songs.map(renderItem)}</div>
      <div className="bottom">
        <div className="close" role="button" onClick={(e) => onClose()}>
          <span>收起队列</span>
        </div>
      </div>
    </MyPlayQueue>,
    document.getElementById("root")
  );
}

export default PlayQueue;