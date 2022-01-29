/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 18:21:04
 * @LastEditTime : 2022-01-29 23:48:48
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\play-show\track-info.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import { Track } from 'types';
import defaultCover from '@/static/image/default-cover';
import { formatSecond } from 'horen-util';

interface Props {
  track?: Track;
}

export default function TrackInfo(props: Props) {
  const { track } = props;

  const genre =
    !!track?.genre && track?.genre !== 'undefined' ? track.genre : '未知流派';

  const year = track?.year ? `${track?.year}年` : '未知年份';

  return (
    <MyTrackInfo className="play-show__track-info">
      <div className="cover">
        <img src={`data:image/png;base64,${track?.picture || defaultCover}`} />
      </div>
      <div className="track-info">
        <div className="title-duration">
          <span className="title">{track?.title || 'Unkown Title'}</span>
          <span className="duration">
            <span>{formatSecond(track?.duration || 0)}</span>
          </span>
        </div>
        <div className="artist-album">
          <span>
            {track?.artist || 'Unkown Artist'}&nbsp;&nbsp;-&nbsp;&nbsp;
          </span>
          <span>{track?.album || 'Uncategory'}</span>
        </div>
        <div className="year">
          <span>{year}&nbsp;&nbsp;</span>
        </div>
        <div className="genre">
          <span>{genre}</span>
        </div>
      </div>
    </MyTrackInfo>
  );
}

const MyTrackInfo = styled.div`
  width: 400px;
  img {
    width: 100%;
    border-radius: 8px;
  }
  .track-info {
    margin: 32px 0 0 0;
    padding: 0 0 0 16px;
    color: #f1f1f1;
    .title-duration {
      display: flex;
      align-items: flex-end;
      margin: 0 0 24px 0;
      .title {
        font-size: 2rem;
      }
      .duration {
        font-size: 1.2rem;
        margin: 0 16px;
        color: #717273;
        font-weight: 300;
      }
    }
    .year {
      margin: 8px 0;
      color: #717273;
      font-size: 0.8rem;
    }
    .artist-album {
      margin: 8px 0;
      color: #717273;
    }
    .genre {
      color: #717273;
      font-size: 0.9rem;
    }
  }
`;
