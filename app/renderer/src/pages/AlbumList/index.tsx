import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { Track } from '../../api';
import { HorenContext } from '../../App';
import Modal from '../../components/Modal';
import Page, { PageProps } from '../_page';
import AlbumPanel from './Panel';
import AlbumItem from './Item';

const ALBUM = styled.div`
  margin: 0;
  padding: 0;
  .list-container {
    height: calc(100vh - 160px);
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
  }
`;

export type AlbumListPageProps = PageProps;

export type Album = {
  index: number;
  title: string;
  artist: string;
  tracks: string[];
  trackList: Track[];
  cover?: string;
};

export function AlbumListPage({ visible }: AlbumListPageProps) {
  const [albumItemKey, setAlbumItemKey] = useState(0);

  const [pickAlbum, setPickAlbum] = useState<Album | null>(null);
  const {
    current,
    playOrPause,
    addToPlaylist,
    isInPlaylist,
    isPlaying,
    albumList,
  } = useContext(HorenContext);

  const handleOpen = (album: Album) => {
    setPickAlbum(album);
  };

  return (
    <Page visible={visible}>
      <ALBUM>
        <div className="list-container perfect-scrollbar">
          {albumList?.map((album) => (
            <AlbumItem
              key={album.title}
              album={album}
              onOpen={handleOpen}
              coverKey={albumItemKey}
            />
          ))}
        </div>
      </ALBUM>
      {pickAlbum && (
        <Modal alpha={0.9}>
          <AlbumPanel
            album={pickAlbum}
            isPlaying={isPlaying}
            currentTrack={current}
            onClose={() => setPickAlbum(null)}
            onPlay={(track) => playOrPause(track.uid)}
            onPause={(track) => playOrPause(track.uid)}
            onAdd={(track) => addToPlaylist([track.uid])}
            onAddAll={(tracks) =>
              addToPlaylist(tracks.map((track) => track.uid))
            }
            isAdd={(track) => isInPlaylist(track?.uid)}
            onRefresh={() => setAlbumItemKey(new Date().valueOf())}
          />
        </Modal>
      )}
    </Page>
  );
}
