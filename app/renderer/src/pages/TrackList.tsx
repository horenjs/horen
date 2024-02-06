import React, { useContext, useEffect, useRef } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDownloadDone } from 'react-icons/md';
import styled from 'styled-components';

import { useVirtualizer } from '@tanstack/react-virtual';

import { readDB, Track } from '../api';
import { HorenContext } from '../App';
import { normalizeDuration } from '../utils';
import Page, { PageProps } from './_page';

const TRACKLIST = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
  .track-list-container {
    height: calc(100vh - 152px);
    padding-right: 24px;
  }
  .list-header {
    color: #c6c6c6;
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    display: flex;
    div {
      font-size: 0.8rem;
      &:nth-child(1) {
        margin: 0;
      }
      &:nth-child(2) {
        flex-grow: 1;
      }
      &:nth-child(3) {
        width: 100px;
      }
      &:nth-child(4) {
        width: 100px;
        margin: 0 16px;
      }
    }
  }
`;

const PureItem = styled.div`
  color: #f1f1f1;
  margin: 4px 0;
  padding-right: 8px;
  align-items: center;
  font-size: 0.9rem;
  height: 100%;
  &:nth-child(2n) {
    background-color: #3a3a3a6d;
  }
  &.playing {
    background-color: #10b45475 !important;
  }
  .index {
    text-align: center;
    margin-right: 16px;
    margin-left: 4px;
    width: 44px;
  }
  .first {
    display: flex;
    margin: 4px 0;
    align-items: center;
    justify-content: space-between;
    padding-right: 32px;
    flex-grow: 1;
    .title {
      flex-grow: 1;
      min-width: 240px;
      width: 100%;
    }
    .operate {
      display: flex;
      align-items: center;
      .play {
        margin-left: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
      }
      .add {
        display: flex;
        align-items: center;
      }
    }
  }
  .artist {
    font-weight: 300;
    width: 120px;
    text-align: left;
  }
  .album {
    font-weight: 300;
    width: 160px;
    padding: 0 8px;
    text-align: left;
  }
  .duration {
    text-align: center;
    width: 40px;
  }
  .date {
    text-align: center;
    width: 60px;
  }
  .genre {
    text-align: center;
    width: 80px;
  }
`;

const PromptText = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #686868;
  div {
    display: flex;
    align-items: center;
  }
  span {
    font-size: 1.5rem;
    margin-left: 16px;
  }
`;

export type PlayListPageProps = PageProps;

export type TrackItemProps = {
  index?: number;
  track: Track;
  playing?: boolean;
  onPlayOrPause: (uid: string) => void;
  onAdd: (uid: string) => void;
  isAdd: (uid: string) => boolean;
  style: React.CSSProperties;
};

export default function TrackList(props: PlayListPageProps) {
  const { visible } = props;
  const {
    trackList,
    playOrPause,
    setToTrackList,
    isInPlaylist,
    current,
    isPlaying,
    addToPlaylist,
  } = useContext(HorenContext);

  const parentRef = useRef<HTMLTableElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: trackList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
  });

  const handlePlayOrPause = (uid: string) => {
    playOrPause(uid);
  };

  const handleAdd = (uid: string) => {
    addToPlaylist([uid]);
  };

  const Prompt = () => (
    <PromptText>
      <span>请在设置页面设置音乐库</span>
    </PromptText>
  );

  useEffect(() => {
    readDB<Track[]>('tracks').then((tracks) => {
      setToTrackList(tracks);
    });
  }, [visible]);

  return (
    <Page visible={visible}>
      <TRACKLIST className="track-list">
        {!trackList.length && <Prompt />}
        <div
          className="track-list-container perfect-scrollbar"
          ref={parentRef}
          style={{ overflow: 'auto', display: 'block' }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const track = trackList[virtualItem.index];
              return (
                <TrackPureItem
                  key={track.src}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    display: 'flex',
                  }}
                  index={virtualItem.index + 1}
                  track={track}
                  onPlayOrPause={handlePlayOrPause}
                  onAdd={handleAdd}
                  isAdd={isInPlaylist}
                  playing={isPlaying && current?.uid === track.uid}
                />
              );
            })}
          </div>
        </div>
      </TRACKLIST>
    </Page>
  );
}

function TrackPureItem({
  track,
  index,
  playing,
  onPlayOrPause,
  onAdd,
  isAdd,
  style,
}: TrackItemProps) {
  const handlePlayOrPause = () => {
    if (onPlayOrPause && track) onPlayOrPause(track.uid);
  };

  const handleAdd = () => {
    if (onAdd && track) onAdd(track.uid);
  };

  return (
    <PureItem
      key={track?.src}
      className={playing ? 'playing' : ''}
      style={style}
    >
      <div className="index">
        <span>{index}</span>
      </div>
      <div className="first">
        <div className="title">{track?.title}</div>
        <div className="operate">
          {playing ? (
            <div onClick={handlePlayOrPause} className="play">
              <FaPause size={20} />
            </div>
          ) : (
            <div onClick={handlePlayOrPause} className="play">
              <FaPlay />
            </div>
          )}
          {track && !isAdd(track.uid) ? (
            <div onClick={handleAdd} className="add">
              <IoMdAdd size={24} />
            </div>
          ) : (
            <MdOutlineDownloadDone size={24} />
          )}
        </div>
      </div>
      <div className="artist single-line">{track?.artist}</div>
      <div className="album single-line">{track?.album}</div>
      <div className="duration">
        {track?.duration !== undefined && normalizeDuration(track?.duration)}
      </div>
      <div className="date">
        {track?.date !== 'undefined' ? track?.date?.slice(0, 4) : '未知'}
      </div>
      <div className="genre">{track?.genre}</div>
    </PureItem>
  );
}
