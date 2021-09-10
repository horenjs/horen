import { ISong } from "@/types";
import React from "react";
import styled from 'styled-components';

import Cover from './cover';
import Operate from "./operate";

import CloseIcon from '@/assets/icons/close.svg';
import MinusIcon from '@/assets/icons/minus.svg';

const Container = styled.div`
  position: relative;
  width: 600px;
  height: 300px;
  display: flex;
  background-color: #fff;
`;

const Top = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 600px;
  height: 24px;
  cursor: pointer;
  &:hover {
    .close {
      visibility: visible;
    }
  }
  .item {
    position: absolute;
    top: 0;
    height: 24px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .minus {
    right: 24px;
    &:hover {
      background-color: #82E0AA;
    }
  }
  .close {
    right: 0;
    &:hover {
      background-color: red;
    }
  }
`;

const Left = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Right = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
`;


function App () :React.ReactElement {
  const [isCoverRunning, setIsCoverRunning] = React.useState(true);

  const coverImg = `
    https://mintforge-1252473272.cos.ap-nanjing.myqcloud.com/image/img22.jpg
  `;

  const handlePlay = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsCoverRunning(!isCoverRunning);
  }

  const song: ISong = {
    title: "Thousands Miles Away",
    singer: "Kiki Louis",
    path: './sdfa.mp3',
  }

  return (
    <Container className="home">
      <Top>
        <div className="minus item">
          <img src={MinusIcon} alt="minus" />
        </div>
        <div className="close item">
          <img src={CloseIcon} alt="close" />
        </div>
      </Top>
      <Left>
        <Cover
          source={coverImg}
          title="test"
          running={isCoverRunning}
          onClick={handlePlay}
        />
      </Left>
      <Right>
        <Operate
          {...song}
          onPause={handlePlay}
          isPaused={!isCoverRunning}
        />
      </Right>
    </Container>
  );
}

export default App;
