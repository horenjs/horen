import React from 'react';
import styled from 'styled-components';
import { HowlPlayer } from '../utils';
import { getFile } from '../api';

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
  const player = new HowlPlayer();
  const { onExpand, visible = true } = props;

  const handleClick = () => {
    if (onExpand) onExpand();
  };

  const handlePlay = () => {
    /*
     */
    const filename =
      'D:\\Music\\歌手合集\\Westlife\\1999 - Westlife FLAC\\Westlife - (01) Swear It Again.flac';
    getFile(filename).then((value: any) => {
      player.trackList = [
        {
          src: 'data:audio/wav;base64,' + value,
        },
      ];
    });
  };

  return (
    <PLAYBAR className="play-bar">
      <Cover onClick={handleClick}></Cover>
      {visible && (
        <div>
          <Title></Title>
          <Singer></Singer>
          <AlbumTitle></AlbumTitle>
        </div>
      )}
      {visible && (
        <div style={{ flexGrow: 1, margin: '0 16px' }}>
          <Seeker></Seeker>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Mode></Mode>
            <Prev></Prev>
            <Pause onClick={handlePlay}></Pause>
            <Next></Next>
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
