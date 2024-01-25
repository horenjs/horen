import React, { useContext } from 'react';
import styled from 'styled-components';
import { HorenContext } from '../App';
import { Track } from '../api';
import Page, { PageProps } from './_page';

const PLAYING = styled.div`
  .song {
    user-select: none;
  }
`;

export type PlayListPageProps = {} & PageProps;

export default function PlayList(props: PlayListPageProps) {
  const { visible } = props;
  const { player } = useContext(HorenContext);

  const handleClick = (track: Track) => {
    player.play(track);
  };

  return (
    <Page visible={visible}>
      <PLAYING style={{ display: visible ? 'block' : 'none' }}>
        {player.playList?.map((track: Track) => (
          <div
            className="song"
            key={track.title}
            onDoubleClick={() => handleClick(track)}
          >
            {track.title}
          </div>
        ))}
      </PLAYING>
    </Page>
  );
}
