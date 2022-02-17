import React from 'react';
import styled from "styled-components";
import {Track} from "types";
import {TrackDC} from "@/data-center";
import defaultCover from "@/static/image/default-cover";
import { BsArrowsAngleExpand } from 'react-icons/bs';
import { BiSkipPrevious, BiSkipNext, BiPause, BiPlay } from 'react-icons/bi';
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
        <div className={'icon-expand'} onClick={handleExpand}>
          <BsArrowsAngleExpand size={32} color={'#d1d2d3'} />
        </div>
      </div>
      <div className={'operate'}>
        <div className={'title'}>
          <span>{ currentTrack?.title }</span>
        </div>
        <div className={'artist'}>
          <span>{ currentTrack?.artist }</span>
        </div>
        <div className={'prev-next electron-no-drag'}>
          <div className={'op-item prev'} onClick={e => player.skip('prev')}>
            <BiSkipPrevious size={32} />
          </div>
          <div className={'op-item play-or-pause'}>
            {
              player.playing
                ? <span onClick={handlePlayOrPause}><BiPause size={36} /></span>
                : <span onClick={handlePlayOrPause}><BiPlay size={36} /></span>
            }
          </div>
          <div className={'op-item next'} onClick={e => player.skip('next')}>
            <BiSkipNext size={32} />
          </div>
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
    &:hover {
      .icon-expand {
        visibility: visible;
      }
      .loading {
        visibility: hidden;
      }
    }
    img {
      height: 100%;
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
    width: calc(100% - 128px);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .title {
      color: #f1f1f1;
      width: 100%;
      padding-left: 8px;
    }
    .artist {
      font-size: 0.8rem;
      color: #d1d1d1;
      margin: 4px 0;
      width: 100%;
      padding-left: 8px;
    }
    .prev-next {
      display: flex;
      align-items: center;
      width: 100%;
      .op-item {
       color: #d1d2d3;
        cursor: pointer;
      }
    }
  }
`;