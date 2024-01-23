import React, { useContext } from 'react';
import styled from 'styled-components';
import { HorenContext } from '../App';

const PLAYBAR = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Cover = styled.div`
  height: 52px;
  width: 52px;
  background-color: #333;
  margin-right: 8px;
  img {
    width: 100%;
  }
`;

const Title = styled.div`
  width: 180px;
  height: 20px;
  background-color: #333;
`;

const Singer = styled.div`
  width: 40px;
  height: 14px;
  background-color: #333;
  margin-top: 2px;
`;

const AlbumTitle = styled.div`
  width: 60px;
  height: 14px;
  background-color: #333;
  margin-top: 2px;
`;

const Seeker = styled.div`
  width: 100%;
  height: 4px;
  background-color: green;
  margin-bottom: 8px;
`;

const Mode = styled.div`
  height: 32px;
  width: 32px;
  background-color: blue;
`;

const Prev = styled.div`
  height: 32px;
  width: 32px;
  background-color: red;
  margin-left: 8px;
`;

const Pause = styled.div`
  height: 32px;
  width: 32px;
  background-color: red;
  margin-left: 8px;
`;

const Next = styled.div`
  height: 32px;
  width: 32px;
  background-color: red;
  margin-left: 8px;
`;

const Volume = styled.div`
  height: 32px;
  width: 64px;
  background-color: cyan;
  margin-left: 8px;
`;

const More = styled.div`
  width: 108px;
  height: 32px;
  background-color: #333;
`;

export type PlayBarProps = {
  onExpand?: () => void;
  visible?: boolean;
};

export default function PlayBar(props: PlayBarProps) {
  const { onExpand, visible = true } = props;
  const { player } = useContext(HorenContext);

  const handleClick = () => {
    if (onExpand) onExpand();
  };

  const handlePlay = () => {};

  return (
    <PLAYBAR className="play-bar">
      <Cover onClick={handleClick}>
        <img
          src={player.currentTrack?.cover}
          alt={player.currentTrack?.title}
        />
      </Cover>
      {visible && (
        <div>
          <Title>{player.currentTrack?.title}</Title>
          <Singer>{player.currentTrack?.artist}</Singer>
          <AlbumTitle>{player.currentTrack?.album}</AlbumTitle>
        </div>
      )}
      {visible && (
        <div style={{ flexGrow: 1, margin: '0 16px' }}>
          <Seeker></Seeker>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Mode></Mode>
            <Prev onClick={() => player.prev()}></Prev>
            <Pause onClick={handlePlay}></Pause>
            <Next onClick={() => player.next()} />
            <Volume></Volume>
          </div>
        </div>
      )}
      {visible && (
        <div>
          <More />
        </div>
      )}
    </PLAYBAR>
  );
}
