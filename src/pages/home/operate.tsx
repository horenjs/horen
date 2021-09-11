import React from 'react';
import styled from 'styled-components';
import { ISong } from '@/types';

import Prev from '@/assets/icons/prev.svg';
import Pause from '@/assets/icons/pause.svg';
import Play from '@/assets/icons/play.svg';
import Next from '@/assets/icons/next.svg';
import Random from '@/assets/icons/random.svg';
import Setting from '@/assets/icons/setting-tri-line.svg';


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

type IProps = {
  onPause?: React.MouseEventHandler<HTMLElement>,
  onPrev?: React.MouseEventHandler<HTMLElement>,
  onNext?: React.MouseEventHandler<HTMLElement>,
  onSetting?: React.MouseEventHandler<HTMLElement>,
  isPaused?: boolean,
  progress?: number,
} & ISong;

export default function (props: IProps) :React.ReactElement {
  const {
    common = { title: 'No Title', artist: 'No Artist'},
    onPause,
    onSetting,
    onPrev,
    onNext,
    isPaused = false,
    progress = 0,
  } = props;

  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false);

  const handleClickSetting = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsPopoverVisible(!isPopoverVisible);
  }

  return (
    <Operate>
      <div className="header">
        <h3>{ common.title }</h3>
        <h4>{ common.artist }</h4>
      </div>
      <div className="operator no-drag">
        <img
          src={Prev}
          alt="prev"
          className="item"
          onClick={onPrev}
        />
        <img
          src={isPaused ? Play : Pause}
          alt="pause"
          className="item"
          onClick={onPause}
        />
        <img
          src={Next}
          alt="next"
          className="item"
          onClick={onNext}
        />
        <img src={Random} alt="random" className="random item" />
        <Popover
          className="setting item"
          onClick={handleClickSetting}
        >
          <img
            src={Setting}
            alt="setting"
          />
          <div
            className="setting-options"
            style={{display: isPopoverVisible ? 'block' : 'none'}}
          >
            <div className="option-item">关于</div>
            <div className="option-item">设置</div>
            <div className="option-item">打开目录..</div>
            <div className="option-item" onClick={onSetting}>打开文件...</div>
          </div>
        </Popover>
      </div>
      <div className="progress">
        <div className="back item"></div>
        <div className="front item" style={{width:`${progress}%`}}></div>
      </div>
    </Operate>
  );
}
