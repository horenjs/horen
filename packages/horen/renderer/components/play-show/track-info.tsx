/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 18:21:04
 * @LastEditTime : 2022-01-29 22:49:24
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

  const genre = (track?.genre && track?.genre === 'undefined') || '未知流派';
  const year = track?.year ? `（ ${track?.year}年 ）` : '（ 未知年份 ）';

  return (
    <MyTrackInfo className="play-show__track-info">
      <div className="cover">
        <img src={`data:image/png;base64,${track?.picture || defaultCover}`} />
      </div>
      <div className="track-info">
        <div className="title">
          <span>{track?.title || 'Unkown Title'}</span>
        </div>
        <div className="artist">
          <span>
            {track?.artist || 'Unkown Artist'}&nbsp;&nbsp;-&nbsp;&nbsp;
          </span>
        </div>
        <div className="album">
          <span>{track?.album + year || 'Uncategory'}</span>
        </div>
        <div className="genre">
          <span>{genre}</span>
        </div>
        <div className="duration">
          <span>{formatSecond(track?.duration || 0)}</span>
        </div>
      </div>
    </MyTrackInfo>
  );
}

const MyTrackInfo = styled.div`
  width: 400px;
  img {
    width: 100%;
    border-radius: 4px;
  }
  .track-info {
    margin: 32px 0 0 0;
    color: #f1f1f1;
    .title,
    .artist,
    .album,
    .duration {
      margin: 8px 0;
    }
    .album,
    .artist {
      display: inline-block;
      color: #919293;
    }
    .title {
      font-size: 2rem;
    }
    .album {
      margin: 0 16px 0 0;
    }
    .genre,
    .duration {
      color: #919293;
    }
  }
`;
