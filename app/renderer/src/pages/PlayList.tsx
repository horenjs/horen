import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { getTrack, getTrackList, Track } from '../api';
import { HorenContext } from '../App';
import { includes } from '../components/PlayContext';

const PLAYLIST = styled.ul`
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
  source: string;
  onPlay: (track: Track) => void;
  onAdd: (track: Track) => void;
  trackList: Track[];
};

export default function PlayList(props: PlayListProps) {
  const [trackSrcList, setTrackSrcList] = useState<string[] | null>(null);
  const { visible } = props;
  const { player } = useContext(HorenContext);

  const handlePlay = (track: Track) => {
    player.play(track);
  };

  const handleAdd = (track: Track) => {
    player.add(track);
  };

  useEffect(() => {
    getTrackList().then((list) => {
      setTrackSrcList(list);
    });
  }, []);

  return (
    <PLAYLIST style={{ display: visible ? 'grid' : 'none' }}>
      {trackSrcList?.map((trackSrc) => (
        <TrackItem
          source={trackSrc}
          onPlay={handlePlay}
          onAdd={handleAdd}
          key={trackSrc}
          trackList={player.trackList}
        />
      ))}
    </PLAYLIST>
  );
}

function TrackItem({ source, onPlay, onAdd, trackList }: TrackItemProps) {
  const [track, setTrack] = useState<Track | null>(null);

  const handlePlay = () => {
    if (onPlay && track) onPlay(track);
  };

  const handleAdd = () => {
    if (onAdd && track) onAdd(track);
  };

  useEffect(() => {
    getTrack(source).then(setTrack);
  }, [source]);

  return (
    <Item key={track?.src}>
      <img src={track?.cover} alt={track?.title} />
      <div className="title">{track?.title}</div>
      <div className="artist">{track?.artist}</div>
      <div className="duration">{track?.duration?.toFixed(2)}</div>
      <button onClick={handlePlay}>Play</button>
      {track && includes(trackList, track) ? (
        ''
      ) : (
        <button onClick={handleAdd}>Add</button>
      )}
    </Item>
  );
}
