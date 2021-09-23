import React from 'react';
import styled from 'styled-components';
import { ISong } from '@/types';

// prev song
import Prev from '@/assets/icons/prev.svg';
import PrevLight from '@/assets/icons/prev-light.svg';
// pause
import Pause from '@/assets/icons/pause.svg';
import Play from '@/assets/icons/play.svg';
// next song
import Next from '@/assets/icons/next.svg';
import NextLight from '@/assets/icons/next-light.svg';
// play order
import Random from '@/assets/icons/random.svg';
import Asc from '@/assets/icons/asc.svg';
import Loop from '@/assets/icons/loop.svg';
import Repeat from '@/assets/icons/repeat.svg';
// music settings
import Setting from '@/assets/icons/setting-tri-line.svg';
// music playing list
import MusicPlaying from '@/assets/icons/music-playing.svg';
import MusicPlayingGreen from '@/assets/icons/music-playing-green.svg';


const Operate = styled.div`
  width: 250px;
  margin: -16px 0 0 0;
  .header {
    h3,h4 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      line-height: 2;
    }
    h4 {
      color: #777;
    }
  }
  .operator {
    display: flex;
    align-items: center;
    margin: 24px 0 0 0;
    .item {
      margin-right: 12px;
      cursor: pointer;
    }
    .random {
      width: 22px;
      height: 22px;
      margin-left: 4px;
    }
    .setting {
      margin-left: 4px;
    }
  }
  .progress {
    position: relative;
    margin: 24px 0 0 0;
    .item {
      position: absolute;
      height: 4px;
      width: 100%;
      background-color: #82E0AA;
    }
    .front {
      background-color: #555;
      width: 70%;
    }
  }
`;

const PlayOrder = styled.div`
  position: relative;
  .play-orders {
    position: absolute;
    bottom: 28px;
    left: -32px;
    background-color: #fff;
    border: 1px solid #acacac;
    border-radius: 4px;
    .play-order-item {
      width: 88px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.75rem;
      padding: 4px 0;
      &:hover {
        background-color: #f1f1f1;
      }
      img {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const Popover = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  .setting-options {
    position: absolute;
    bottom: 32px;
    width: 84px;
    font-size: 12px;
    border: 1px solid #aaa;
    border-radius: 4px;
    background-color: #fff;
    .option-item {
      box-sizing: border-box;
      padding: 4px 8px;
      -webkit-app-region: no-drag;
      &:hover {
        background-color: #f1f1f1;
      }
    }
  }
`;

interface IProps {
  onPause?: React.MouseEventHandler<HTMLElement>,
  onPrev?: React.MouseEventHandler<HTMLElement>,
  onNext?: React.MouseEventHandler<HTMLElement>,
  onSetting?: (e: React.MouseEvent<HTMLElement>, flag: string) => void,
  onList?: React.MouseEventHandler<HTMLElement>,
  onSelectOrder: (e: React.MouseEvent<HTMLElement>, flag: string) => void;
  isPaused?: boolean,
  progress?: number,
  song?: ISong,
  playOrder?: string,
};

export default function (props: IProps) :React.ReactElement {
  const {
    song,
    onPause,
    onSetting,
    onPrev,
    onNext,
    onList,
    onSelectOrder,
    isPaused = false,
    progress = 0,
    playOrder = 'asc',
  } = props;

  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false);
  const [isOrderPopVisible, setIsOrderPopVisible] = React.useState(false);
  // operator icon color
  const [isNextHover, setIsNextHover] = React.useState(false);
  const [isPrevHover, setIsPrevHover] = React.useState(false);
  const [isMusicPlayHover, setIsMusicPlayHover] = React.useState(false);

  const handleClickSetting = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsPopoverVisible(!isPopoverVisible);
  }

  const handleClickOrder = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsOrderPopVisible(!isOrderPopVisible);
  }

  const handleSelectOrder = (e: React.MouseEvent<HTMLElement>, flag: string) => {
    e.preventDefault();
    setIsOrderPopVisible(false);
    if (onSelectOrder) onSelectOrder(e, flag);
  } 

  const handleMouseHover = (
    e: React.MouseEvent<HTMLElement>,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    flag: boolean
  ) => {
    e.preventDefault();
    setter(flag);
  }

  const getPlayOrderIcon = (order: string) => {
    let orderIcon;

    switch (order) {
      case 'asc':
        orderIcon = Asc;
        break;
      case 'random':
        orderIcon = Random;
        break;
      case 'loop':
        orderIcon = Loop;
        break;
      case 'repeat':
        orderIcon = Repeat;
        break;
    }

    return orderIcon;
  }

  return (
    <Operate className="fadeInLeft">
      <div className="header">
        <h3>{ song ? song.common.title : 'No Song'}</h3>
        <h4>{ song ? song.common.artist : 'No Singer'}</h4>
      </div>
      <div className="operator no-drag">
        <img
          src={isPrevHover ? PrevLight : Prev}
          alt="prev"
          className="item"
          onClick={onPrev}
          onMouseEnter={e => handleMouseHover(e, setIsPrevHover, true)}
          onMouseLeave={e => handleMouseHover(e, setIsPrevHover, false)}
        />
        <img
          src={isPaused ? Play : Pause}
          alt="pause"
          className="item"
          onClick={onPause}
        />
        <img
          src={isNextHover ? NextLight : Next}
          alt="next"
          className="item"
          onClick={onNext}
          onMouseEnter={e => handleMouseHover(e, setIsNextHover, true)}
          onMouseLeave={e => handleMouseHover(e, setIsNextHover, false)}
        />
        <PlayOrder className="random item">
          <div className="play-orders no-drag" style={{display: isOrderPopVisible ? 'block' : 'none'}}>
            <div onClick={e => handleSelectOrder(e, 'random')} className="play-order-item">
              <img src={Random} alt="random" />
              <span>随机播放</span>
            </div>
            <div onClick={e => handleSelectOrder(e, 'asc')} className="play-order-item">
              <img src={Asc} alt="asc" />
              <span>顺序播放</span>
            </div>
            <div onClick={e => handleSelectOrder(e, 'loop')} className="play-order-item">
              <img src={Loop} alt="loop" />
              <span>列表播放</span>
            </div>
            <div onClick={e => handleSelectOrder(e, 'repeat')} className="play-order-item">
              <img src={Repeat} alt="repeat" />
              <span>单曲循环</span>
            </div>
          </div>
          <img
            src={getPlayOrderIcon(playOrder)}
            alt="random"
            onClick={handleClickOrder}
          />
        </PlayOrder>
        <Popover className="setting item" onClick={handleClickSetting}>
          <img src={Setting} alt="setting" />
          <div
            className="setting-options"
            style={{display: isPopoverVisible ? 'block' : 'none'}}
          >
            <div className="option-item" onClick={e => onSetting(e, 'open-about')}>关于</div>
            <div className="option-item" onClick={e => onSetting(e, 'open-config')}>设置</div>
            <div className="option-item" onClick={e => onSetting(e, 'open-dirs')}>打开目录..</div>
            <div className="option-item" onClick={e => onSetting(e, 'open-files')}>打开文件...</div>
          </div>
        </Popover>
        <img
          src={isMusicPlayHover ? MusicPlayingGreen : MusicPlaying}
          alt="music-playing"
          className="music-playing item"
          onClick={onList}
          onMouseEnter={e => handleMouseHover(e, setIsMusicPlayHover, true)}
          onMouseLeave={e => handleMouseHover(e, setIsMusicPlayHover, false)}
        />
      </div>
      <div className="progress">
        <div className="back item"></div>
        <div className="front item" style={{width:`${progress}%`}}></div>
      </div>
    </Operate>
  );
}
