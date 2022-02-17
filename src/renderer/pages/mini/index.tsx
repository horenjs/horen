import React from 'react';
import styled from "styled-components";
import {Track} from "types";
import {TrackDC} from "@/data-center";
import defaultCover from "@/static/image/default-cover";
import { BiSkipPrevious, BiSkipNext, BiPause, BiPlay } from 'react-icons/bi';
import { RiPictureInPictureExitLine } from 'react-icons/ri';
import {player} from "@/App";
import { Loader } from "@/components/loader";

interface MiniPlayerProps {
  currentTrack: Track,
  onExpand?(): void;
}

export default function MiniPlayer(props: MiniPlayerProps) {
  const { currentTrack, onExpand } = props;

  const [cover, setCover] = React.useState<string>(defaultCover);

  const handleExpand = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onExpand) onExpand();
  }

  const handlePlayOrPause = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    player.playOrPause();
  }

  React.useEffect(() => {
    (async () => {
      const key = currentTrack?.albumKey;
      if (key) {
        const res = await TrackDC.getAlbumCover(key);
        if (res.code === 1) setCover(res.data);
      }
    })();
  }, [currentTrack])

  return (
    <MyMini className={'page-mini-player electron-drag'}>
      <div className={'cover electron-no-drag'}>
        <img src={`data:image/png;base64,${cover}`} alt={currentTrack?.albumKey} />
        {
          player.playing && <div className={'loading'}><Loader style={'pulse'} /></div>
        }
      </div>
      <div className={'operate'}>
        <div className={'op-item title text-overflow'} title={currentTrack?.title}>
          <span>{ currentTrack?.title }</span>
        </div>
        <div className={'op-item artist'}>
          <span>{ currentTrack?.artist }</span>
        </div>
        <div className={'op-item prev-next electron-no-drag'}>
          <div className={'pn-item prev'} onClick={e => player.skip('prev')}>
            <BiSkipPrevious size={32} />
          </div>
          <div className={'pn-item play-or-pause'}>
            {
              player.playing
                ? <span onClick={handlePlayOrPause}><BiPause size={36} /></span>
                : <span onClick={handlePlayOrPause}><BiPlay size={36} /></span>
            }
          </div>
          <div className={'pn-item next'} onClick={e => player.skip('next')}>
            <BiSkipNext size={32} />
          </div>
        </div>
        <div className={'op-item expand electron-no-drag'} onClick={handleExpand}>
          <RiPictureInPictureExitLine size={20} />
        </div>
      </div>
    </MyMini>
  )
}

const MyMini = styled.div`
  width: 400px;
  height: 128px;
  display: flex;
  align-items: center;
  .cover {
    height: 128px;
    position: relative;
    cursor: pointer;
    img {
      height: 128px;
      width: 128px;
      object-fit: cover;
    }
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .icon-expand {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      visibility: hidden;
    }
  }
  .operate {
    height: 128px;
    width: calc(100% - 32px);
    padding: 16px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .op-item {
      color: #d1d2d3;
      margin: 0;
      padding: 0;
      cursor: pointer;
    }
    .title {
      color: #f1f1f1;
      width: calc(100% - 48px);
      padding-left: 8px;
    }
    .artist {
      font-size: 0.8rem;
      color: #d1d1d1;
      margin: 4px 0;
      width: calc(100% - 48px);
      padding-left: 8px;
    }
    .expand {
      margin: -3px 0 0 8px;
      padding: 0;
      height: 20px;
      &:hover {
        color: #fff;
      }
    }
    .prev-next {
      display: flex;
      align-items: center;
      .pn-item {
        color: #d1d2d3;
        cursor: pointer;
        &:hover {
          color: #fff;
        }
      }
    }
  }
`;