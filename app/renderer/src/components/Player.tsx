import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { default as PlayerBar } from './PlayBar';
import { HorenContext } from '../App';

const PLAYER = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #555;
  transition: top 0.25s ease-in-out;
`;

const PlayBar = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const Cover = styled.div`
  display: flex;
  width: 45%;
  height: calc(100vh - 64px);
  padding: 16px 16px 32px 32px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .frame {
    width: 80%;
  }
`;

const Picture = styled.div`
  width: 320px;
  height: 320px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  width: 320px;
  height: 200px;
  max-width: 480px;
  background-color: #111;
  margin-top: 16px;
`;

const Lyric = styled.div`
  display: flex;
  width: 55%;
  height: calc(100vh - 64px);
  padding: 16px 32px 32px 16px;
  justify-content: center;
  align-items: center;
`;

const LyricText = styled.div`
  height: 100%;
  width: 100%;
  background-color: #333;
`;

export type PlayerProps = {};

export default function Player(props: PlayerProps) {
  const [expanded, setExpanded] = useState(false);
  const top = !expanded ? 'calc(100vh - 64px)' : '0';
  const { player } = useContext(HorenContext);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <PLAYER className="player" style={{ top }}>
      <PlayBar>
        <PlayerBar onExpand={handleClick} visible={!expanded} />
      </PlayBar>
      <div style={{ display: 'flex' }}>
        <Cover className="player-cover">
          <div className="frame">
            <Picture>
              <img src={player.currentTrack?.cover} />
            </Picture>
            <Info />
          </div>
        </Cover>
        <Lyric className="player-lyric">
          <LyricText />
        </Lyric>
      </div>
    </PLAYER>
  );
}
