import React, { useEffect, useState } from 'react';
import Page, { PageProps } from './_page';
import styled from 'styled-components';
import { Track, readDBStore, readCoverSource } from '../api';

const ALBUM = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  padding-bottom: 88px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
`;

export type AlbumListPageProps = {} & PageProps;

export type Album = {
  index: string;
  title: string;
  artist: string;
  tracks: Track[];
};

export type OriginAlbum = {
  index: string;
  title: string;
  artist: string;
  tracks: string;
};

export function AlbumListPage({ visible }: AlbumListPageProps) {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [trackList, setTrackList] = useState<Track[]>([]);

  useEffect(() => {
    (async () => {
      const tracks = await readDBStore('tracks');
      const albums: OriginAlbum[] = await readDBStore('albums');
      const finals = albums.map((album) => {
        return {
          index: album.index,
          title: album.title,
          artist: album.artist,
          tracks: album.tracks
            .split(',')
            .map((trackIndex) => tracks[Number(trackIndex)]),
        };
      });
      setAlbumList(finals);
    })();
  }, []);

  return (
    <Page visible={visible}>
      <ALBUM>
        {albumList?.map((album) => {
          return (
            <AlbumItem
              key={album.index + album.title}
              albumName={album.title}
              artistName={album.artist}
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

function AlbumItem({
  albumName,
  artistName,
  onPlay,
  onAdd,
  isAdd,
}: AlbumItemProps) {
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
      <div className="title">{artistName}</div>
    </Item>
  );
}
