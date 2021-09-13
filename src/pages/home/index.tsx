import { ISong } from "@/types";
import React from "react";
import styled from 'styled-components';
// electron
const electron = window.require('electron');
const { ipcRenderer } = electron;

import { Howl, Howler } from 'howler';

import Cover from './cover';
import Operate from "./operate";

import CloseIcon from '@/assets/icons/close.svg';
import MinusIcon from '@/assets/icons/minus.svg';
import DefaultCover from '@/assets/image/defaultCover.png';

const Container = styled.div`
  position: relative;
  width: 600px;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  background-color: rgba(255,255,255,0.95);
  user-select: none;
  -webkit-app-region: drag;
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
    z-index: 2;
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
    border-radius: 0 4px 0 0;
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
  const [isPaused, setIsPaused] = React.useState(true);
  const [isLyric, setIsLyric] = React.useState(false);
  const [songList, setSongList] = React.useState<ISong[]>();
  const [progress, setProgress] = React.useState(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [sound, setSound] = React.useState<any>();

  /**
   * default cover image
   */
  let coverImg = DefaultCover;
  
  const handlePrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  const handlePause = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (songList) {
      setIsPaused(!isPaused);
    }
  }

  const handleNext = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (songList) {
      if (currentIndex < songList.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }
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

  React.useEffect(() => {
    ipcRenderer.on('setting-open-files-reply', (event: any, arg: any[]) => {
      if (arg.length !== 0) setSongList(arg);
    });
  }, [])

  React.useEffect(() => {
    let timer: any;

    if (songList) {
      /**
       * if sound is existed, remove it.
       */
      if (sound) {
        console.log('sound exists');
        sound.unload();
        setSound(undefined);
        console.log('clear the sound.');
      }

      /**
       * create a new Howl
       */
      // 先将进度条设为 0
      // 看起来跳转的速度好像快一点
      setProgress(0);
      const song = songList[currentIndex];
      const src = song.path;
      const s = new Howl({src, autoplay: true});
      setIsPaused(false);

      setSound(s);

      /**
       * get the duration of song after loaded.
       */
      let _duration = 0;
      s.once('load', () => {
        _duration = s.duration();
        // set the main window title
        const title = song.common.title + ' - ' + song.common.artist;
        ipcRenderer.send('title', title);
        console.log('_duration: ', _duration);
      })

      /**
       * update progess per second.
       */
      timer = setInterval(() => {
        let _seek = s.seek();
        const _progress = (_seek / _duration) * 100;
        ipcRenderer.send('progress', _progress);
        setProgress(_progress);
      }, 500);

      /**
       * when sound is end, go to the next
       */
      s.once('end', () => {
        if (currentIndex < songList.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      });
    }

    /**
     * clear the interval timer.
     */
    return () => clearInterval(timer);

  }, [songList, currentIndex])

  React.useEffect(() => {
    if (sound) {
      if (isPaused) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  }, [isPaused])

  /**
   * convert the uint8arry to the base64 image for cover
   */
  if (songList && songList[currentIndex].common) {
    if ("picture" in songList[currentIndex].common) {
      const picture = songList[currentIndex].common.picture[0];
      const { format, data } = picture;

      coverImg = `
        data:${format};base64,${uint8arrayToBase64(data)}
      `;
    } 
  }

  return (
    <Container className="home" id="home-container">
      <Top>
        <div className="minus item no-drag" onClick={handleMinimize}>
          <img src={MinusIcon} alt="minus" />
        </div>
        <div className="close item no-drag" onClick={handleClose}>
          <img src={CloseIcon} alt="close" />
        </div>
      </Top>
      <Left>
        <Cover
          source={coverImg}
          title="test"
          running={!isPaused}
          onClick={handlePause}
        />
      </Left>
      <Right>
        <Operate
          common={songList && songList[currentIndex].common}
          onPrev={handlePrev}
          onPause={handlePause}
          onNext={handleNext}
          onSetting={handleSetting}
          isPaused={isPaused}
          progress={progress}
        />
      </Right>
    </Container>
  );
}

function uint8arrayToBase64(u8arr: Uint8Array) {
  let ChunkSize = 0x8000;
  let index = 0;
  let length = u8arr.length;
  let result = '';
  let slice: any;
  while (index < length) {
    slice = u8arr.subarray(index, Math.min(index + ChunkSize, length));
    result += String.fromCharCode.apply(null, slice);
    index += ChunkSize;
  }

  return btoa(result);
}

export default App;
