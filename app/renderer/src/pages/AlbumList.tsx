import React, { useEffect, useState } from 'react';
import Page, { PageProps } from './_page';
import styled from 'styled-components';
import { Track, readDBStore, readCoverSource } from '../api';
import { FaPlay } from 'react-icons/fa6';

const ALBUM = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  padding-bottom: 88px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
`;

export type AlbumListPageProps = {} & PageProps;

export type Album = {
  title: string;
  tracks: Track[];
};

export function AlbumListPage({ visible }: AlbumListPageProps) {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [trackList, setTrackList] = useState([]);

  useEffect(() => {
    (async () => {
      const tracks = await readDBStore('tracks');
      const albums = await readDBStore('albums');
      setTrackList(tracks);
      const als = [];
      for (const album in albums) {
        const a = {
          title: '',
          tracks: [],
        };
        a.title = album;
        a.tracks = albums[album].map((i: number) => tracks[i]);
        als.push(a);
      }
      setAlbumList(als);
    })();
  }, []);

  return (
    <Page visible={visible}>
      <ALBUM>
        {albumList?.map((album) => {
          return <TrackItem key={album.title} track={album.tracks[0]} />;
        })}
      </ALBUM>
    </Page>
  );
}

const Item = styled.li`
  background-color: #999;
  height: 240px;
  margin: 8px;
  list-style: none;
  img {
    width: 100%;
    max-height: 132px;
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

export type TrackItemProps = {
  index?: number;
  track: Track;
  playing?: boolean;
  onPlay?: (track: Track) => void;
  onAdd?: (track: Track) => void;
  isAdd?: (track: Track) => boolean;
};

function TrackItem({ track, onPlay, onAdd, isAdd }: TrackItemProps) {
  const [cover, setCover] = useState('');

  const handlePlay = () => {
    if (onPlay && track) onPlay(track);
  };

  const handleAdd = () => {
    if (onAdd && track) onAdd(track);
  };

  useEffect(() => {
    if (track?.src) {
      readCoverSource(track?.src).then((source) => {
        setCover(source);
      });
    }
  }, [track]);

  return (
    <Item key={track?.src}>
      <img src={cover} alt={track?.title} />
      <div className="title">{track?.title}</div>
      <div className="artist">{track?.artist}</div>
      <div className="duration">{track?.duration?.toFixed(2)}</div>
      <button onClick={handlePlay}>
        <FaPlay />
      </button>
      {isAdd && track && !isAdd(track) && (
        <button onClick={handleAdd}>Add</button>
      )}
    </Item>
  );
}
