/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:12:15
 * @LastEditTime : 2022-01-21 00:25:14
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \alo\packages\alo\renderer\components\control-panel\index.tsx
 * @Description  :
 */
import React from "react";
import styled from "styled-components";
import { ISong } from "../../../../../src/types";
import defaultCover from './default-cover';

const My = styled.div`
  height: 80px;
  background-color: #2d2e2f;
  display: flex;
  position: relative;
  align-items: center;
  padding: 0 32px;
  color: #aaa;
  .progress {
    width: 100%;
    position: absolute;
    top: -2px;
    left: 0;
    &:hover {
      .front {
        .pointer {
          visibility: visible;
        }
      }
    }
    .back {
      width: 100%;
      background-color: #515253;
      height: 4px;
      position: absolute;
      z-index: 0;
    }
    .front {
      width: 0%;
      background-color: #25b184;
      height: 4px;
      position: absolute;
      top: 0;
      z-index: 1;
      // transition: all .1s ease;
      .pointer {
        position: absolute;
        height: 12px;
        width: 12px;
        background-color: #1ece9d;
        border-radius: 6px;
        right: -6px;
        top: -4px;
        visibility: hidden;
      }
    }
  }
  .panel {
    width: 100%;
    display: flex;
    align-items: center;
    .song-cover {
      height: 52px;
      width: 52px;
      background-color: #999;
      border-radius: 4px;
      img {
        width: 100%;
        object-fit: cover;
      }
    }
    .song-info {
      margin: 0 0 0 16px;
      width: 160px;
      .title {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #f1f1f1;
      }
      .artist {
        font-size: 0.8rem;
        color: #777;
        margin-top: 4px;
      }
    }
    .song-operate {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -32px;
      .prev,
      .pause,
      .next,
      .play {
        margin: 0 8px;
        cursor: pointer;
        user-select: none;
      }
    }
    .song-list {
      span {
        cursor: pointer;
      }
    }
  }
`;

export interface ControlPanelProps {
  song: ISong;
  state: string;
  progress: number | string;
  onPlay(): void;
  onPrev(): void;
  onNext(): void;
  onPause(): void;
  onSeek(e: React.MouseEvent<HTMLElement>): void;
  onQueue(e: React.MouseEvent<HTMLElement>): void;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const {
    song,
    state,
    progress,
    onPrev,
    onPlay,
    onPause,
    onNext,
    onSeek,
    onQueue,
  } = props;

  const handlePrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onPrev();
  };

  const handlePlay = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onPlay();
  };

  const handlePause = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onPause();
  };

  const handleNext = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onNext();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onSeek(e);
  };

  return (
    <My className="control-panel">
      <div className="progress" onClick={handleSeek}>
        <div className="back"></div>
        <div className="front" style={{ width: `${progress}%` }}>
          <span className="pointer"></span>
        </div>
      </div>
      <div className="panel">
        <div className="song-cover">
          <img
            src={`data:image/png;base64,${song && song.picture ? song?.picture : defaultCover}`}
            alt={song?.title || "unkown-song"}
          />
        </div>
        <div className="song-info">
          <div className="title">{song?.title || "Unkown Song"}</div>
          <div className="artist">{song?.artist || "Unkown Artist"}</div>
        </div>
        <div className="song-operate">
          <div className="prev" onClick={handlePrev}>
            上一首
          </div>
          {state !== "playing" ? (
            <div className="play" onClick={handlePlay}>
              播放
            </div>
          ) : (
            <div className="paused" onClick={handlePause}>
              暂停
            </div>
          )}
          <div className="next" onClick={handleNext}>
            下一首
          </div>
        </div>
        <div className="song-list">
          <span onClick={(e) => onQueue(e)}>播放队列</span>
        </div>
      </div>
    </My>
  );
};

export default ControlPanel;
