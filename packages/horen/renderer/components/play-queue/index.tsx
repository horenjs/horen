/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 16:24:28
 * @LastEditTime : 2022-01-22 12:30:53
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\play-queue\index.tsx
 * @Description  : 右侧滑出的歌曲列表
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Track } from 'types';
import Queue from './queue';

export interface PlayQueueProps {
  /**
   * track list
   */
  tracks: Track[];
  /**
   * selected track
   */
  track: Track;
  visible: boolean;
  onPlay(track: Track): void;
  onClose(): void;
}

export function PlayQueue(props: PlayQueueProps) {
  const { tracks, track, visible, onPlay, onClose } = props;

  const classname = `component-playlist ${
    visible ? 'slideInRight' : 'slideOutRight'
  }`;

  return ReactDOM.createPortal(
    <MyPlayQueue className={classname}>
      <div className="header">
        <div className="title">播放队列</div>
        <div className="count">{tracks.length} 首歌曲</div>
      </div>
      <Queue track={track} tracks={tracks} onPlay={onPlay} />
      <div className="bottom">
        <div className="close" role="button" onClick={(e) => onClose()}>
          <span>收起队列</span>
        </div>
      </div>
    </MyPlayQueue>,
    document.getElementById('root') || document.body
  );
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
    animation: slideOutRight 0.25s;
    animation-fill-mode: forwards;
  }
  &.slideInRight {
    animation: slideInRight 0.25s;
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
