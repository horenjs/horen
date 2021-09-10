import { ISong } from "@/types";
import React from "react";
import styled from 'styled-components';
// electron
const electron = window.require('electron');
const { ipcRenderer } = electron;

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
  const [fileList, setFileList] = React.useState([]);

  const coverImg = `
    https://mintforge-1252473272.cos.ap-nanjing.myqcloud.com/image/img22.jpg
  `;

  const handlePlay = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsCoverRunning(!isCoverRunning);
  }

  const handleSetting = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    ipcRenderer.send('setting-open-files');
  }

  const handleMinimize = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    ipcRenderer.send('minimize');
  }

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    ipcRenderer.send('quit');
  }

  const song: ISong = {
    title: "Thousands Miles Away",
    singer: "Kiki Louis",
    path: './sdfa.mp3',
  }

  React.useEffect(() => {
    ipcRenderer.on('setting-open-files-reply', (event: any, arg: any) => {
      setFileList(arg);
    })
  }, [])

  return (
    <Container className="home">
      <Top>
        <div className="minus item" onClick={handleMinimize}>
          <img src={MinusIcon} alt="minus" />
        </div>
        <div className="close item" onClick={handleClose}>
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
          onSetting={handleSetting}
          isPaused={!isCoverRunning}
        />
      </Right>
      <audio src={fileList[0]} autoPlay></audio>
    </Container>
  );
}

export default App;
