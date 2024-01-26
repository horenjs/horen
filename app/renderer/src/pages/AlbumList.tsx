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
          artist: '',
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
          return (
            <AlbumItem
              key={album.title}
              albumName={album.title}
              artistName=""
            />
          );
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

export type AlbumItemProps = {
  albumName: string;
  artistName: string;
  onPlay?: (track: Track) => void;
  onAdd?: (track: Track) => void;
  isAdd?: (track: Track) => boolean;
};

function AlbumItem({ albumName, onPlay, onAdd, isAdd }: AlbumItemProps) {
  const [cover, setCover] = useState('');

  const handlePlay = () => {};

  const handleAdd = () => {};

  useEffect(() => {
    readCoverSource(albumName).then((source) => {
      setCover(source);
    });
  }, [albumName]);

  return (
    <Item key={albumName}>
      <img src={cover} alt={albumName} />
      <div className="title">{albumName}</div>
    </Item>
  );
}
