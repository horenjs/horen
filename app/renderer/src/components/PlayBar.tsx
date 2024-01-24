import React, { useContext } from 'react';
import styled from 'styled-components';
import { HorenContext } from '../App';
import { IoIosPause } from 'react-icons/io';
import { FaVolumeLow } from 'react-icons/fa6';
import { MdSkipPrevious, MdSkipNext, MdMenuOpen } from 'react-icons/md';
import { TfiLoop } from 'react-icons/tfi';
import { IoIosArrowDown } from 'react-icons/io';

const PLAYBAR = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Cover = styled.div`
  height: 52px;
  width: 52px;
  margin-right: 16px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .arrow {
    color: #d6d6d6;
  }
`;

const Title = styled.div`
  width: 144px;
  height: 20px;
  font-size: 14px;
  color: #e6e6e6;
`;

const Singer = styled.div`
  height: 14px;
  margin-top: 2px;
  font-size: 10px;
  color: #bebebe;
`;

const AlbumTitle = styled.div`
  height: 14px;
  margin-top: 2px;
  font-size: 10px;
  color: #adadad;
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
  color: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Prev = styled.div`
  height: 32px;
  width: 32px;
  margin-left: 8px;
  color: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Pause = styled.div`
  height: 32px;
  width: 32px;
  margin-left: 8px;
  color: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Next = styled.div`
  height: 32px;
  width: 32px;
  margin-left: 8px;
  color: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Volume = styled.div`
  height: 32px;
  width: 64px;
  margin-left: 12px;
  color: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: start;
`;

const More = styled.div`
  width: 108px;
  height: 32px;
  padding-right: 12px;
  color: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: end;
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
      <Cover onClick={handleClick} className="electron-no-drag">
        {visible ? (
          <img
            src={player.currentTrack?.cover}
            alt={player.currentTrack?.title}
          />
        ) : (
          <span className="arrow">
            <IoIosArrowDown size={28} />
          </span>
        )}
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
            <Mode>
              <TfiLoop size={20} />
            </Mode>
            <Prev onClick={() => player.prev()}>
              <MdSkipPrevious size={28} />
            </Prev>
            <Pause onClick={handlePlay}>
              <IoIosPause size={28} />
            </Pause>
            <Next onClick={() => player.next()}>
              <MdSkipNext size={28} />
            </Next>
            <Volume>
              <FaVolumeLow size={19} />
            </Volume>
          </div>
        </div>
      )}
      {visible && (
        <div>
          <More>
            <MdMenuOpen size={28} />
          </More>
        </div>
      )}
    </PLAYBAR>
  );
}
