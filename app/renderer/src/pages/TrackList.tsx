import React, { useContext, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDownloadDone } from 'react-icons/md';
import styled from 'styled-components';

import { readTrackList, Track } from '../api';
import { HorenContext } from '../App';
import Page, { PageProps } from './_page';

const TRACKLIST = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: auto;
  // display: grid;
  // padding-bottom: 88px;
  // grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  ul {
    margin: 0;
    padding: 0;
  }
`;

const PureItem = styled.li`
  display: flex;
  color: #f1f1f1;
  margin: 4px 0;
  align-items: center;
  font-size: 0.9rem;
  .index {
    width: 24px;
    text-align: center;
    margin-right: 16px;
  }
  .first {
    width: 300px;
    display: flex;
    margin: 4px 0;
    align-items: center;
    justify-content: space-between;
    padding-right: 32px;
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
    width: 120px;
  }
  .album {
    width: 200px;
  }
`;

export type PlayListPageProps = {} & PageProps;

export type TrackItemProps = {
  index?: number;
  track: Track;
  playing?: boolean;
  onPlay: (track: Track) => void;
  onAdd: (track: Track) => void;
  isAdd: (track: Track) => boolean;
};

export default function TrackList(props: PlayListPageProps) {
  const { visible } = props;
  const { player, trackList } = useContext(HorenContext);

  const handlePlay = (track: Track) => {
    player.play(track);
  };

  const handleAdd = (track: Track) => {
    player.add(track);
  };

  useEffect(() => {
    readTrackList().then((tracks) => {
      trackList.set(tracks);
    });
  }, [visible]);

  return (
    <Page visible={visible}>
      <TRACKLIST
        className="track-list perfect-scrollbar"
        style={{ display: visible ? 'block' : 'none' }}
      >
        <ul>
          {trackList.value?.map((track: Track, index: number) => (
            <TrackPureItem
              index={index}
              track={track}
              onPlay={handlePlay}
              onAdd={handleAdd}
              key={track.src}
              isAdd={player.isAdd}
              playing={player.currentTrack?.uid === track.uid}
            />
          ))}
        </ul>
      </TRACKLIST>
    </Page>
  );
}

function TrackPureItem({
  track,
  index,
  playing,
  onPlay,
  onAdd,
  isAdd,
}: TrackItemProps) {
  const handlePlay = () => {
    if (onPlay && track) onPlay(track);
  };

  const handlePause = () => {};

  const handleAdd = () => {
    if (onAdd && track) onAdd(track);
  };

  return (
    <PureItem key={track?.src}>
      <div className="index">
        <span>{index}</span>
      </div>
      <div className="first">
        <div className="title">{track?.title}</div>
        <div className="operate">
          {playing ? (
            <div onClick={handlePause} className="play">
              <FaPause size={20} />
            </div>
          ) : (
            <div onClick={handlePlay} className="play">
              <FaPlay />
            </div>
          )}
          {track && !isAdd(track) ? (
            <div onClick={handleAdd} className="add">
              <IoMdAdd size={24} />
            </div>
          ) : (
            <MdOutlineDownloadDone size={24} />
          )}
        </div>
      </div>
      <div className="artist">{track?.artist}</div>
      <div className="album">{track?.album}</div>
      <div className="duration">{track?.duration?.toFixed(2)}</div>
    </PureItem>
  );
}
