/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:12:15
 * @LastEditTime : 2022-01-30 13:58:40
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
import Slider from '../slider';

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

  const handleSeek = (per: number) => {
    if (onSeek) onSeek(per);
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
    <My className="control-panel electron-drag">
      <div className="progress">
        <Slider progress={progress} onChange={handleSeek} />
      </div>
      <div className="panel">
        <div className="track-cover electron-no-drag">
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
          <div className="title electron-no-drag" title={trackTitle}>
            {trackTitle}
          </div>
          <div className="artist electron-no-drag">
            {track?.artist || 'Unkown Artist'}
          </div>
        </div>
        <div className="track-operate electron-no-drag">
          <div className="prev" onClick={handlePrev} title="上一首">
            ⊻
          </div>
          <div
            className="play-or-pause electron-no-drag"
            onClick={handlePlayOrPause}
          >
            {playing ? (
              <span className="to-pause" title="暂停">
                =
              </span>
            ) : (
              <span className="to-play" title="播放">
                ⊳
              </span>
            )}
          </div>
          <div
            className="next electron-no-drag"
            onClick={handleNext}
            title="下一首"
          >
            ⊻
          </div>
        </div>
        <div className="track-plugin electron-no-drag">
          <div className="rebuild-cache">
            <span
              role={'button'}
              onClick={handleRebuildCache}
              title="重建缓存数据库"
            >
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
    top: -4px;
    left: 0;
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
        height: 52px;
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
        &:hover {
          color: #f1f1f1;
        }
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
        left: 1px;
        top: 0px;
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
