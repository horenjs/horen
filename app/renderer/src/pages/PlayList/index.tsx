import React, { useContext, useRef } from 'react';
import styled from 'styled-components';

import { useVirtualizer } from '@tanstack/react-virtual';

import { Track } from '../../api';
import { HorenContext } from '../../App';
import Page, { PageProps } from '../_page';
import PlayListItem from './ListItem';

const Container = styled.div`
  height: 100%;
`;

const VirtualParent = styled.div`
  height: calc(100vh - 152px);
  padding-right: 32px;
`;

const VirtualContainer = styled.div``;

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

export default function PlayList(props: PlayListPageProps) {
  const { visible } = props;
  const { playOrPause, playlist, isPlaying, current, removeFromPlaylist } =
    useContext(HorenContext);

  const parentRef = useRef<HTMLTableElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: playlist.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  const handlePlayOrPause = (track: Track) => {
    playOrPause(track.uid);
  };

  const handleDel = (track: Track) => {
    removeFromPlaylist([track.uid]);
  };

  const Prompt = () => (
    <PromptText>
      <span>请添加歌曲</span>
    </PromptText>
  );

  return (
    <Page visible={visible}>
      <Container>
        {!playlist.length && <Prompt />}
        <VirtualParent
          className="perfect-scrollbar"
          ref={parentRef}
          style={{ overflow: 'auto', display: 'block' }}
        >
          <VirtualContainer
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const track = playlist[virtualItem.index];
              return (
                <PlayListItem
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    display: 'flex',
                  }}
                  track={track}
                  onPlay={handlePlayOrPause}
                  onPause={handlePlayOrPause}
                  onDel={handleDel}
                  isPlaying={isPlaying && current?.uid === track.uid}
                  key={track.uid}
                />
              );
            })}
          </VirtualContainer>
        </VirtualParent>
      </Container>
    </Page>
  );
}
