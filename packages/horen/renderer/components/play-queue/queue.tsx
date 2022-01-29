/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 12:12:32
 * @LastEditTime : 2022-01-29 20:16:58
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\components\play-queue\queue.tsx
 * @Description  :
 */
import React from 'react';
import { Track } from 'types';
import { PlayQueueProps } from './index';
import { Loader } from '../loader';
import { formatSecond } from 'horen-util';

type QueueProps = Omit<PlayQueueProps, 'onClose' | 'visible'>;

const Queue: React.FC<QueueProps> = (props) => {
  const { tracks, track, onPlay } = props;

  const handlePlay = (e: React.MouseEvent<HTMLElement>, item: Track) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay(item);
  };

  const renderItem = (item: Track) => {
    const isPlaying = item?.title === track?.title;

    return (
      <div
        className="queue-item"
        onClick={(e) => handlePlay(e, item)}
        key={item?.src}
      >
        <div className="info">
          <div
            className="title"
            style={{ color: isPlaying ? '#1ece9d' : '#fcfcfc' }}
          >
            <div className="title-text">{item?.title || 'Unkown Song'}</div>
          </div>
          <div
            className="artist"
            style={{ color: isPlaying ? '#1ece9d' : '#aaa' }}
          >
            {item?.artist || 'Unkown Artist'}
          </div>
        </div>
        <div className="operate"></div>
        {isPlaying && (
          <div className="indicator">
            <Loader style="pulse" />
          </div>
        )}
        <div className="duration">{formatSecond(item?.duration || 0)}</div>
      </div>
    );
  };

  return <div className="queue">{tracks && tracks.map(renderItem)}</div>;
};

export default Queue;
