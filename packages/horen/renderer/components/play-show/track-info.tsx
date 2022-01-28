/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 18:21:04
 * @LastEditTime : 2022-01-28 19:27:40
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\components\play-show\track-info.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import { Track } from 'types';
import defaultCover from '@/static/image/default-cover';

interface Props {
  track?: Track;
}

export default function TrackInfo(props: Props) {
  const { track } = props;

  return (
    <MyTrackInfo className="play-show__track-info">
      <div className="cover">
        <img src={`data:image/png;base64,${track?.picture || defaultCover}`} />
      </div>
      <div className="track-info">
        <div className="artist">
          <span>{track?.artist || 'Unkown Artist'}</span>
        </div>
        <div className="album">
          <span>{track?.album || 'Uncategory'}</span>
        </div>
        <div className='duration'>
          <span>{track?.duration || '0:00' }</span>
        </div>
      </div>
    </MyTrackInfo>
  );
}

const MyTrackInfo = styled.div`
  width: 256px;
  img {
    width: 100%;
    border-radius: 4px;
  }
  .track-info {
    margin: 32px 0 0 0;
    color: #f1f1f1;
  }
`;
