import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { readTrackList, Track } from '../api';
import { HorenContext } from '../App';
import { includes } from '../components/PlayContext';

const TRACKLIST = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  padding-bottom: 88px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
`;

const Item = styled.li`
  background-color: #999;
  height: 240px;
  margin: 8px;
  list-style: none;
  img {
    width: 100%;
  }
  .title {
    max-width: 100%;
    height: 20px;
    overflow: hidden;
  }
  .artist {
    max-width: 100%;
    height: 20px;
    overflow: hidden;
  }
  .duration {
    max-width: 100%;
  }
`;

export type PlayListProps = {
  visible?: boolean;
};

export type TrackItemProps = {
  track: Track;
  onPlay: (track: Track) => void;
  onAdd: (track: Track) => void;
  isAdd: (track: Track) => boolean;
};

export default function TrackList(props: PlayListProps) {
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
    <TRACKLIST style={{ display: visible ? 'grid' : 'none' }}>
      {trackList.value?.map((track: Track) => (
        <TrackItem
          track={track}
          onPlay={handlePlay}
          onAdd={handleAdd}
          key={track.src}
          isAdd={player.isAdd}
        />
      ))}
    </TRACKLIST>
  );
}

function TrackItem({ track, onPlay, onAdd, isAdd }: TrackItemProps) {
  const handlePlay = () => {
    if (onPlay && track) onPlay(track);
  };

  const handleAdd = () => {
    if (onAdd && track) onAdd(track);
  };

  return (
    <Item key={track?.src}>
      <img src={track?.cover} alt={track?.title} />
      <div className="title">{track?.title}</div>
      <div className="artist">{track?.artist}</div>
      <div className="duration">{track?.duration?.toFixed(2)}</div>
      <button onClick={handlePlay}>Play</button>
      {track && !isAdd(track) && <button onClick={handleAdd}>Add</button>}
    </Item>
  );
}
