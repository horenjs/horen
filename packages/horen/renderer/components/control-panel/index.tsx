/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:12:15
 * @LastEditTime : 2022-01-29 18:35:34
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\components\control-panel\index.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import defaultCover from '../../static/image/default-cover';
import { Track } from 'types';
import { Loader } from '../loader';
import { player } from '../../App';

export interface ControlPanelProps {
  track?: Track;
  playing?: boolean;
  progress?: number | string;
  onPrev?(e?: React.MouseEvent<HTMLElement>): void;
  onNext?(e?: React.MouseEvent<HTMLElement>): void;
  onPlayOrPause?(e?: React.MouseEvent<HTMLElement>): void;
  onSeek?(per: number): void;
  onShow?(e?: React.MouseEvent<HTMLElement>): void;
  onOpenQueue?(e?: React.MouseEvent<HTMLElement>): void;
  onRebuildCache?(e?: React.MouseEvent<HTMLElement>): void;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const {
    track = player.currentTrack as Track,
    playing = player.playing,
    progress = 0,
    onPrev,
    onPlayOrPause,
    onNext,
    onSeek,
    onShow,
    onOpenQueue,
    onRebuildCache,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = React.useRef();

  const trackTitle =
    track?.title || track?.src?.split('.').slice(-2, -1)[0] || 'Unkown track';

  const handlePrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    player.skip('prev');
    if (onPrev) onPrev(e);
  };

  const handlePlayOrPause = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    player.playOrPause();
    if (onPlayOrPause) onPlayOrPause(e);
  };

  const handleNext = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    player.skip('next');
    if (onNext) onNext(e);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = e.target as any;
    // 进度条距离可视区域左边的距离
    const left = target.getBoundingClientRect().left;
    // 进度条的宽度
    const width = ref.current ? ref.current.offsetWidth : target.offsetWidth;
    // 鼠标点击的位置 只需要 X 轴的位置即可
    const x = e.clientX;
    if (onSeek) onSeek((x - left) / width);
  };

  const handlePlayShow = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShow) onShow(e);
  };

  const handleOpenQueue = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenQueue) onOpenQueue(e);
  };

  const handleRebuildCache = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRebuildCache) onRebuildCache(e);
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
          <div className="up-arrow" onClick={handlePlayShow} role="button">
            ︿
          </div>
          {playing && (
            <div className="loader">
              <Loader style="pulse" />
            </div>
          )}
        </div>
        <div className="track-info">
          <div className="title" title={trackTitle}>
            {trackTitle}
          </div>
          <div className="artist">{track?.artist || 'Unkown Artist'}</div>
        </div>
        <div className="track-operate">
          <div className="prev" onClick={handlePrev}>
            ⊻
          </div>
          <div className="play-or-pause" onClick={handlePlayOrPause}>
            {playing ? (
              <span className="to-pause">=</span>
            ) : (
              <span className="to-play">⊳</span>
            )}
          </div>
          <div className="next" onClick={handleNext}>
            ⊻
          </div>
        </div>
        <div className="track-plugin">
          <div className="rebuild-cache">
            <span role={'button'} onClick={handleRebuildCache}>
              ↺
            </span>
          </div>
          <div className="open-queue" role="button" onClick={handleOpenQueue}>
            <div>打开队列</div>
            <span>{player.trackList.length} 首歌曲</span>
          </div>
        </div>
      </div>
    </My>
  );
};

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
      position: relative;
      &:hover {
        .up-arrow {
          visibility: visible;
        }
        .loader {
          visibility: hidden;
        }
      }
      img {
        width: 100%;
        object-fit: cover;
      }
      .up-arrow {
        width: 100%;
        height: 100%;
        text-align: center;
        position: absolute;
        line-height: 44px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        font-weight: 600;
        color: #f1f1f1;
        cursor: pointer;
        visibility: hidden;
      }
      .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
      .play-or-pause,
      .next {
        cursor: pointer;
        user-select: none;
      }
      .prev {
        font-size: 1.8rem;
        transform: rotate(90deg);
        font-weight: 500;
      }
      .next {
        font-size: 1.8rem;
        transform: rotate(-90deg);
        font-weight: 500;
      }
      .play-or-pause {
        width: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 24px;
        position: relative;
        left: 3px;
        .to-pause {
          position: relative;
          left: 4px;
          display: inline-block;
          transform: rotate(90deg);
          font-size: 2.3rem;
        }
        .to-play {
          position: relative;
          top: -3px;
          left: 2px;
          display: inline-block;
          font-size: 2.5rem;
          font-weight: 200;
          transform: scaleX(72%);
        }
      }
    }
    .track-plugin {
      display: flex;
      align-items: center;
      .rebuild-cache {
        font-size: 2rem;
        font-weight: 400;
        margin: 0 16px 0 0;
        cursor: pointer;
        color: #515253;
        &:hover {
          color: #919293;
        }
      }
      .open-queue {
        cursor: pointer;
        user-select: none;
        text-align: center;
        color: #717273;
        &:hover {
          color: #919293;
        }
        div {
          font-size: 0.8rem;
        }
        span {
          font-size: 0.6rem;
        }
      }
    }
  }
`;

export default ControlPanel;
