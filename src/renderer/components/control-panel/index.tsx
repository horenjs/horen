/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:12:15
 * @LastEditTime : 2022-02-01 17:15:55
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\control-panel\index.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import {useRecoilState} from "recoil";
import { currentTrackSeekState, currentTrackIsPlayingState, settingState } from '@/store'
import defaultCover from '../../static/image/default-cover';
import { Loader } from '../loader';
import { player } from '@/App';
import Slider from '../slider';
import {TrackDC, MainwindowDC, SettingDC} from "@/data-center";
import { MdOutlineSkipNext, MdOutlineSkipPrevious, MdPause, MdOutlinePlayArrow } from 'react-icons/md';
import { ImVolumeHigh, ImVolumeMedium, ImVolumeLow, ImVolumeMute2, ImLoop2 } from 'react-icons/im';
import { RiRepeatOneLine, RiOrderPlayLine, RiShuffleFill } from 'react-icons/ri';
import {PlayOrder} from "types";

export interface ControlPanelProps {
  onOpenShow?(e?: React.MouseEvent<HTMLElement>): void;
  onOpenQueue?(e?: React.MouseEvent<HTMLElement>): void;
  onRebuildCache?(e?: React.MouseEvent<HTMLElement>): void;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const {
    onOpenShow,
    onOpenQueue,
    onRebuildCache,
  } = props;

  const [cover, setCover] = React.useState<string>();
  /**
   * curren track seek?
   */
  const [seek, setSeek] = useRecoilState(currentTrackSeekState);
  /**
   * is player muted?
   */
  const [isMuted, setIsMuted] = React.useState(false);
  /**
   * is current track playing?
   */
  const [isPlaying, setIsPlaying] = useRecoilState(currentTrackIsPlayingState);

  const [setting, ] = useRecoilState(settingState);

  const [playOrder, setPlayOrder] = React.useState<PlayOrder>('in-order');

  const trackTitle =
    player.currentTrack?.title
    || player.currentTrack?.src?.split('.').slice(-2, -1)[0]
    || 'Unknown track';

  const handlePrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    player.skip('prev');
  };

  const handlePlayOrPause = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsPlaying(!isPlaying);
    player.playOrPause();
  };

  const handleNext = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    player.skip('next');
  };

  const handleSeek = (per: number) => {
    player.seek = per * player.duration;
  };

  const handlePlayShow = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenShow) onOpenShow(e);
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

  const handleVolume = (vol: number) => {
    player.volume = vol
  };

  const handleMute = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMuted) player.mute();
    else player.unmute();
    setIsMuted(!isMuted);
  }
  
  const handleClickPlayOrder = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const orders: [PlayOrder, PlayOrder, PlayOrder, PlayOrder] = ['in-order', 'shuffle', 'repeat', 'loop'];
    const i = orders.indexOf(playOrder);
    if (i >= 0 && i < orders.length - 1) {
      setPlayOrder(orders[i + 1]);
      player.mode = orders[i + 1];
    } else {
      setPlayOrder(orders[0]);
      player.mode = orders[0];
    }

    (async () => {
      await SettingDC.set({...setting, "track.status.playMode": player.mode});
    })();
  }
  
  const renderPlayOrder = (o: PlayOrder) => {
    let el: React.ReactNode;
    
    switch (o) {
      case 'in-order':
        el = <RiOrderPlayLine size={18} />;
        break;
      case 'loop':
        el = <ImLoop2 size={16} />;
        break;
      case 'repeat':
        el = <RiRepeatOneLine size={19} />;
        break;
      case 'shuffle':
        el = <RiShuffleFill size={19} />;
        break;
    }
    
    return el;
  }
 
  React.useEffect(() => {
    if (player.currentTrack) {
      const key = player.currentTrack.albumKey;
      const title = player.currentTrack?.title;
      const artist = player.currentTrack?.artist;

      if (key) {
        (async () => {
          const co = await TrackDC.getAlbumCover(key);
          const c = co.code === 1 ? co.data : player.currentTrack?.picture || defaultCover;
          setCover(c);
        })()
      } else {
        setCover(defaultCover);
      }

      if (title) {
        (async () => {
          await MainwindowDC.setTitle(title + ' - ' + artist);
        })();
      }
    } else {
      setCover(defaultCover);
    }
  }, [player.currentTrack]);

  // 每隔一秒刷新播放进度
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSeek(player.seek);
      (async () => await MainwindowDC.setProgress(player.seek / player.duration))();
    }, 1000);

    return () => clearInterval(timer);
  }, [seek]);

  React.useEffect(() => {
    setPlayOrder(setting["track.status.playMode"]);
  }, [setting]);

  return (
    <My className="control-panel electron-drag">
      <div className="progress">
        <Slider progress={(player.seek / player.duration) * 100} onChange={handleSeek} />
      </div>
      <div className="panel">
        <div className="track-cover electron-no-drag">
          <img
            src={`data:image/png;base64,${cover}`}
            alt={player.currentTrack?.title || 'unkown-track'}
          />
          <div className="up-arrow" onClick={handlePlayShow} role="button">
            ︿
          </div>
          {player.playing && (
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
            {player.currentTrack?.artist || 'Unkown Artist'}
          </div>
        </div>
        <div className="track-operate electron-no-drag">
          <div className="op-item prev" onClick={handlePrev} title="上一首">
            <MdOutlineSkipPrevious />
          </div>
          <div
            className="op-item play-or-pause electron-no-drag"
            onClick={handlePlayOrPause}
          >
            {
              isPlaying ? (
                <span className="to-pause" title="暂停">
                  <MdPause />
                </span>
              ) : (
                <span className="to-play" title="播放">
                  <MdOutlinePlayArrow />
                </span>
              )
            }
          </div>
          <div
            className="op-item next electron-no-drag"
            onClick={handleNext}
            title="下一首"
          >
            <MdOutlineSkipNext />
          </div>
          <div className="op-item volume electron-no-drag">
            <div className="volume-icon" onClick={handleMute}>
              {
                isMuted || player.volume === 0
                  ? <ImVolumeMute2 />
                  : player.volume > 0.7
                    ? <ImVolumeHigh />
                    : player.volume > 0.4
                      ? <ImVolumeMedium />
                      : <ImVolumeLow />
              }
            </div>
            <div className="adjust-volume">
              <Slider progress={player.volume * 100} onChange={handleVolume} />
            </div>
          </div>
          <div
            className={'op-item play-order'}
            onClick={handleClickPlayOrder}
          >{ renderPlayOrder(playOrder) }</div>
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
            <span>{player.trackList?.length} 首歌曲</span>
          </div>
        </div>
      </div>
    </My>
  );
};

const My = styled.div`
  height: 80px;
  background-color: #252627;
  display: flex;
  position: relative;
  align-items: center;
  padding: 0 32px;
  color: #aaa;
  border-radius: inherit;
  .progress {
    width: 100%;
    position: absolute;
    top: -8px;
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
      .op-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 80px;
        &:hover {
          color: #f1f1f1;
        }
      }
      .prev {
        font-size: 1.9rem;
      }
      .next {
        font-size: 1.9rem;
      }
      .play-or-pause {
        font-size: 1.8rem;
        margin: 0 8px;
        .to-pause {
          height: 80px;
          display: flex;
          align-items: center;
        }
        .to-play {
          height: 80px;
          display: flex;
          align-items: center;
        }
      }
      .volume {
        font-size: 1.6rem;
        margin: 0 16px;
        padding: 0 0 3px 0;
        height: 80px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &:hover {
          color: #f1f1f1;
        }
        .volume-icon {
          font-size: 1.3rem;
          height: 19px;
        }
        .adjust-volume {
          height: 4px;
          display: block;
          width: 50px;
          padding: 0 0 0 8px;
          position: relative;
          top: -2px;
        }
      }
      .play-order {
        width: 32px;
        justify-content: center;
        padding: 1px 0 0 0;
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
