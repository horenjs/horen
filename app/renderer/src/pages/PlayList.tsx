import React, { useContext } from 'react';
import styled from 'styled-components';
import { HorenContext } from '../App';
import { Track } from '../api';

const PLAYING = styled.div`
  .song {
    user-select: none;
  }
`;

export type PlayingProps = {
  visible?: boolean;
};

export default function Playing(props: PlayingProps) {
  const { visible } = props;
  const { player } = useContext(HorenContext);

  const handleClick = (track: Track) => {
    player.play(track);
  };

  return (
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
  );
}
