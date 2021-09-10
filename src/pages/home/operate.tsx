import React from 'react';
import styled from 'styled-components';
import { ISong } from '@/types';

import Prev from '@/assets/icons/prev.svg';
import Pause from '@/assets/icons/pause.svg';
import Play from '@/assets/icons/play.svg';
import Next from '@/assets/icons/next.svg';
import Random from '@/assets/icons/random.svg';
import Setting from '@/assets/icons/setting.svg';


const Operate = styled.div`
  width: 250px;
  margin: -16px 0 0 0;
  .header {
    h3,h4 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 8px 0;
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

type IProps = {
  onPause?: React.MouseEventHandler<HTMLElement>,
  onSetting?: React.MouseEventHandler<HTMLElement>,
  isPaused?: boolean,
} & ISong;

export default function (props: IProps) :React.ReactElement {
  const {
    title,
    singer,
    path,
    onPause,
    onSetting,
    isPaused = false,
  } = props;

  return (
    <Operate>
      <div className="header">
        <h3>{ title }</h3>
        <h4>{ singer }</h4>
      </div>
      <div className="operator">
        <img src={Prev} alt="prev" className="item" />
        <img
          src={isPaused ? Play : Pause}
          alt="pause"
          className="item"
          onClick={onPause}
        />
        <img src={Next} alt="next" className="item" />
        <img src={Random} alt="random" className="random item" />
        <img
          src={Setting}
          alt="setting"
          className="setting item"
          onClick={onSetting}
        />
      </div>
      <div className="progress">
        <div className="back item"></div>
        <div className="front item"></div>
      </div>
    </Operate>
  );
}
