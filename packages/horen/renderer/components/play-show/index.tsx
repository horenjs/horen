/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 18:20:34
 * @LastEditTime : 2022-01-30 00:24:16
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\play-show\index.tsx
 * @Description  :
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Track } from 'types';
import TrackInfo from './track-info';
import { ANIMATION_DELAY } from '../../../constant';

interface Props {
  playingTrack?: Track;
  visible: boolean;
  onClose(): void;
}

export default function PlayShow(props: Props) {
  const { playingTrack, visible, onClose } = props;

  const [isMounting, setIsMounting] = React.useState(true);
  const [ani, setAni] = React.useState('hidden');

  const cls = ['play-show', `ani-${ani}`, 'electron-no-drag'];

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  React.useEffect(() => {
    if (visible) {
      if (isMounting) setAni('hidden');
      else setAni('slideInDown');
    } else {
      if (isMounting) setAni('hidden');
      else setAni('slideOutDown');
    }
  }, [visible]);

  React.useEffect(() => {
    const timer = setTimeout(
      () => setIsMounting(false),
      ANIMATION_DELAY.normal * 2
    );
    return () => clearTimeout(timer);
  }, []);

  return ReactDOM.createPortal(
    <MyPlayShow className={cls.join(' ')}>
      <div className="header electron-no-drag">
        <div
          onClick={handleClose}
          role="button"
          className="close electron-no-drag"
        >
          ﹀
        </div>
      </div>
      <div className="left electron-no-drag">
        <TrackInfo track={playingTrack} />
      </div>
      <div className="right">
        <div className="lyric">
          <p>如梦如幻如晴天如风雪的缘</p>
          <p>被命运捉弄</p> <p>随聚散搁浅</p>
          <p>那可以斩断恩仇与善恶的剑</p>
          <p>却斩不断心的犹豫不决</p>
          <p>红尘中由不得我去潇洒</p> <p>天涯</p>
          <p>辗转反侧</p> <p>有个人放不下</p>
          <p>就让我的余生了却相思牵挂</p>
          <p>才无悔此生执着一场啊</p>
          <p>一半在心动着</p> <p>一半难以割舍</p>
          <p>一边备受折磨</p> <p>一边难熬寂寞</p>
          <p>优柔寡断的我</p>
          <p>爱恨纠缠的我</p>
          <p>不愿遗憾错过</p>
          <p>一半自由快乐</p> <p>一半荒芜难过</p>
          <p>一边不曾示弱</p> <p>一边束手无策</p>
          <p>患得患失的我</p>
          <p>拆开心里的锁</p>
          <p>答案在这</p>
          <p>如梦如幻如晴天如风雪的缘</p>
          <p>被命运捉弄</p> <p>随聚散搁浅</p>
          <p>那可以斩断恩仇与善恶的剑</p>
          <p>却斩不断心的犹豫不决</p>
          <p>红尘中由不得我去潇洒</p> <p>天涯</p>
          <p>辗转反侧</p> <p>有个人放不下</p>
          <p>就让我的余生了却相思牵挂</p>
          <p>才无悔此生执着一场啊</p>
          <p>一半在心动着</p> <p>一半难以割舍</p>
          <p>一边备受折磨</p> <p>一边难熬寂寞</p>
          <p>优柔寡断的我</p>
          <p>爱恨纠缠的我</p>
          <p>不愿遗憾错过</p>
          <p>一半自由快乐</p> <p>一半荒芜难过</p>
          <p>一边不曾示弱</p> <p>一边束手无策</p>
          <p>患得患失的我</p>
          <p>拆开心里的锁</p>
          <p>答案在这</p>
          <p>如梦初醒的我</p>
          <p>拆开心里的锁</p>
          <p>他在等我</p>
        </div>
      </div>
    </MyPlayShow>,
    document.getElementById('root') || document.body
  );
}

const MyPlayShow = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: #313233;
  display: flex;
  z-index: 998;
  flex-wrap: wrap;
  &.ani-hidden {
    display: none;
  }
  &.ani-slideInDown {
    animation: slide-in-down ${ANIMATION_DELAY.normal / 1000}s;
    animation-fill-mode: forwards;
  }
  &.ani-slideOutDown {
    animation: slide-out-down ${ANIMATION_DELAY.normal / 1000}s;
    animation-fill-mode: forwards;
  }
  .header {
    width: 100%;
    height: 32px;
    .close {
      display: inline-block;
      font-size: 1.5rem;
      font-weight: 600;
      color: #717273;
      cursor: pointer;
      margin: 8px 0 0 12px;
      &:hover {
        color: #a1a2a3;
      }
    }
  }
  .left {
    width: 50%;
    height: calc(100% - 32px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    width: 50%;
    height: calc(100% - 32px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c1c2c3;
    padding: 0;
    .lyric {
      height: calc(100% - 128px);
      overflow-y: auto;
      text-align: center;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  @keyframes slide-in-down {
    from {
      transform: translate3d(0, 100%, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes slide-out-down {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, 100%, 0);
    }
  }
`;
