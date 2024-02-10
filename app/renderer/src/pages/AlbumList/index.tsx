import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { readDB, Track } from '../../api';
import { HorenContext } from '../../App';
import Modal from '../../components/Modal';
import Page, { PageProps } from '../_page';
import AlbumPanel from './Panel';
import AlbumItem from './Item';
import { useVirtualizer } from '@tanstack/react-virtual';

const ALBUM = styled.div`
  margin: 0;
  padding: 0;
`;

const ListParent = styled.div`
  width: calc(100vw - 52px);
  height: calc(100vh - 152px);
  padding-right: 16px;
`;

const ListContainer = styled.div`
  display: flex;
  padding-right: 8px;
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
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [pickAlbum, setPickAlbum] = useState<Album | null>(null);
  const { current, playOrPause, addToPlaylist, isInPlaylist, isPlaying } =
    useContext(HorenContext);

  const parentRef = useRef<HTMLTableElement | null>(null);
  const LANES = 5;

  const rowVirtualizer = useVirtualizer({
    count: albumList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 196,
    overscan: LANES + 1,
    lanes: 5,
  });

  const handleOpen = (album: Album) => {
    setPickAlbum(album);
  };

  useEffect(() => {
    (async () => {
      const albums: Album[] = await readDB('albums');
      setAlbumList(albums);
    })();
  }, []);

  return (
    <Page visible={visible}>
      <ALBUM>
        <ListParent
          className="perfect-scrollbar"
          ref={parentRef}
          style={{ overflowY: 'auto', overflowX: 'hidden', display: 'block' }}
        >
          <ListContainer
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: `100%`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isEven =
                (Math.floor(virtualRow.index / LANES) + 1) % 2 === 0;
              const left = isEven
                ? `${(4 - virtualRow.lane) * (100 / LANES)}%`
                : `${virtualRow.lane * (100 / LANES)}%`;
              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left,
                    width: `${100 / LANES}%`,
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  data-index={virtualRow.index}
                  data-lane={virtualRow.lane}
                  data-left={virtualRow.lane * (100 / LANES)}
                >
                  <AlbumItem
                    album={albumList[virtualRow.index]}
                    onOpen={handleOpen}
                    coverKey={albumItemKey}
                  />
                </div>
              );
            })}
          </ListContainer>
        </ListParent>
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
