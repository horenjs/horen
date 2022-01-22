/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:12:15
 * @LastEditTime : 2022-01-22 13:56:06
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\control-panel\index.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import defaultCover from '../../static/image/default-cover';
import { Track } from 'types';

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
    padding: 4px 0;
    &:hover {
      top: -3px;
      .back {
        height: 5px;
        background-color: #616263;
      }
      .front {
        height: 5px;
        .pointer {
          visibility: visible;
        }
      }
    }
    .back {
      width: 100%;
      background-color: #414243;
      height: 4px;
      position: absolute;
      z-index: 0;
      top: 2px;
    }
    .front {
      width: 0%;
      background-color: #25b184;
      height: 4px;
      position: absolute;
      top: 2px;
      z-index: 1;
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
    .track-cover {
      height: 52px;
      width: 52px;
      background-color: #999;
      border-radius: 4px;
      img {
        width: 100%;
        object-fit: cover;
      }
    }
    .track-info {
      margin: 0 0 0 16px;
      width: 160px;
      cursor: pointer;
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
    .track-operate {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -64px;
      .prev,
      .player-or-pause,
      .next {
        margin: 0 8px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
`;

export interface ControlPanelProps {
  track?: Track;
  playing: boolean;
  progress: number | string;
  onPrev(): void;
  onNext(): void;
  onPlayOrPause(): void;
  onSeek(per: number): void;
  plugin?: React.ReactNode;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const {
    track,
    playing = false,
    progress = 0,
    onPrev,
    onPlayOrPause,
    onNext,
    onSeek,
    plugin,
  } = props;

  const ref: any = React.useRef();

  const trackTitle =
    track?.title || track?.src?.split('.').slice(-2, -1)[0] || 'Unkown track';

  const handlePrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onPrev();
  };

  const handlePlayOrPause = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onPlayOrPause();
  };

  const handleNext = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onNext();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as any;
    // 进度条距离可视区域左边的距离
    const left = target.getBoundingClientRect().left;
    // 进度条的宽度
    const width = ref.current ? ref.current.offsetWidth : target.offsetWidth;
    // 鼠标点击的位置 只需要 X 轴的位置即可
    const x = e.clientX;
    onSeek((x - left) / width);
  };

  return (
    <My className="control-panel">
      <div className="progress" onClick={handleSeek} ref={ref}>
        <div className="back"></div>
        <div className="front" style={{ width: `${progress}%` }}>
          <span className="pointer"></span>
        </div>
      </div>
      <div className="panel">
        <div className="track-cover">
          <img
            src={`data:image/png;base64,${track?.picture || defaultCover}`}
            alt={track?.title || 'unkown-track'}
          />
        </div>
        <div className="track-info">
          <div className="title" title={trackTitle}>
            { trackTitle }
          </div>
          <div className="artist">{track?.artist || 'Unkown Artist'}</div>
        </div>
        <div className="track-operate">
          <div className="prev" onClick={handlePrev}>
            上一首
          </div>
          <div className="player-or-pause" onClick={handlePlayOrPause}>
            {playing ? '暂停' : '播放'}
          </div>
          <div className="next" onClick={handleNext}>
            下一首
          </div>
        </div>
        <div className="track-plugin">{plugin}</div>
      </div>
    </My>
  );
};

export default ControlPanel;
