import React from "react";
import styled, { keyframes } from 'styled-components';

import SongCover from '@/assets/image/singlecover.png';

interface IProps {
  source: string,
  title: string,
  width?: number,
  height?: number,
  running?: boolean,
  onClick?: React.MouseEventHandler<HTMLElement>,
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Cover = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    animation: ${rotate} infinite 20s linear;
    &.around {
      width: 200px;
      height: 200px;
    }
    &.cover {
      width: 65%;
      height: 65%;
    }
  }
`;

export default function (props: IProps) :React.ReactElement {
  const {
    source,
    title,
    width = 200,
    height = 200,
    running = true,
    onClick,
  } = props;

  return (
    <Cover className="cover" style={{width: width, height: height}}>
      <img
        src={SongCover}
        alt="song-around"
        className="around"
        style={{animationPlayState:running ? 'running' : 'paused'}}
      />
      <img
        src={source}
        alt={title}
        className="cover"
        style={{animationPlayState:running ? 'running' : 'paused'}}
        onClick={onClick}
      />
    </Cover>
  )
}