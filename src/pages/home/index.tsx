import { ISong } from "@/types";
import React from "react";
import styled from 'styled-components';
import _ from 'lodash';
// electron
const electron = window.require('electron');
const { ipcRenderer } = electron;

import { Howl } from 'howler';

import { randomInteger } from '@/utils';

import Cover from './cover';
import Operate from "./operate";
import List from './list';

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
  background-color: rgba(255,255,255,0.99);
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
  // sound player
  const [sound, setSound] = React.useState<any>();
  // song player status
  const [playOrder, setPlayOrder] = React.useState('random');
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  // 
  const [songList, setSongList] = React.useState<ISong[]>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [playHistory, setPlayHistory] = React.useState([0]);
  // lyric & list panel
  const [isLyricVisible, setIsLyricVisible] = React.useState(false);
  const [isListVisible, setIsListVisible] = React.useState(false);

  /**
   * default cover image
   */
  let coverImg = DefaultCover;
  
  const handlePrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (currentIndex >= 0) {
      const prevIndex = playHistory[playHistory.length - 2];
      console.log('prev index: ', prevIndex);
      setCurrentIndex(prevIndex);
      // console.log(playHistory);
      createNewSound(prevIndex);
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
        const nextIndex = getNextIndex(currentIndex, playOrder);
        setCurrentIndex(nextIndex);
        createNewSound(nextIndex);
      }
    }
  }

  const handleSetting = (e: React.MouseEvent<HTMLElement>, flag: string) => {
    e.preventDefault();
    switch (flag) {
      case 'open-files':
        ipcRenderer.send('setting:open-files', {flag});
        break;
    }
  }

  const handleMinimize = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    ipcRenderer.send('minimize');
  }

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const status = {
      progress,
      playOrder,
      isPaused,
      songList,
      currentIndex,
      playHistory,
      isListVisible,
      isLyricVisible,
    }

    ipcRenderer.send('quit', {status});
  }

  const handleList = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsListVisible(!isListVisible);
  }

  const handleSelect = (e: React.MouseEvent<HTMLElement>, s: ISong) => {
    e.preventDefault();
    console.log(s);
    console.log('index: ', songList.indexOf(s));
    const selectIndex = songList.indexOf(s);
    setCurrentIndex(selectIndex);
  }

  const getNextIndex = (cIndex: number, order: string) => {
    let i;

    switch (order) {
      case 'asc':
        i = cIndex + 1;
        break;
      case 'random':
        const plus = randomInteger(0, songList.length)
        const nextIndex = Math.abs(cIndex - plus);
        console.log('next song: ', nextIndex);
        i = nextIndex;
        break;
    }

    return i;
  }

  const createSound = (song: ISong) => {
    const src = song.path;
    const s = new Howl({src, autoplay: true});
    return s;
  }

  const createNewSound = (i: number) => {
    if (sound) {
      sound.unload();
      setSound(undefined);
    }

    const song = songList[i];
    const newSound = createSound(song);
    setSound(newSound);
  }

  // 监听：读取多个文件
  React.useEffect(() => {
    ipcRenderer.on('setting-reply:open-files', (event: any, songs: ISong[]) => {
      console.log(songs);
      if (songs.length !== 0) {
        setSongList(songs);

        if (!sound) {
          const song = songs[currentIndex];
          const newSound = createSound(song);
          setSound(newSound);
        }
      }
    });
  }, [])

  // listening: init the app 
  React.useEffect(() => {
    ipcRenderer.on('config', (event: any, args: any) => {
      args.progess && setProgress(args.progress);
      args.playOrder && setPlayOrder(args.playOrder);
      args.isPaused !== undefined && setIsPaused(args.isPaused);
      args.songList && setSongList(args.songList);
      args.currentIndex && setCurrentIndex(args.currentIndex);
      args.playHistory && setPlayHistory(args.playHistory);
      args.isListVisible !== undefined && setIsListVisible(args.isListVisible);
      args.isLyricVisible !== undefined && setIsLyricVisible(args.isLyricVisible);

      if (args.songList && args.currentIndex) {
        const song = args.songList[args.currentIndex];
        const newSound = createSound(song);

        // 恢复上次播放的时间
        if (args.progress) {
          newSound.seek(args.progress);
        }

        setSound(newSound);
      }
    })
  }, [])

  // listen: sound
  React.useEffect(() => {
    let timer: any;

    if (sound && songList) {
      // get the duration of song after loaded.
      let _duration = 0;
      const song = songList[currentIndex];

      sound.once('load', () => {
        _duration = sound.duration();

        // set the main window title
        const title = song.common.title + ' - ' + song.common.artist;
        ipcRenderer.send('title', title);
        console.log('_duration: ', _duration);
      })

      // when sound is end, go to the next
      sound.once('end', () => {
        if (currentIndex < songList.length - 1) {
          const nextIndex = getNextIndex(currentIndex, playOrder);
          setCurrentIndex(nextIndex);
        }
      });

      // update progess per second.
      timer = setInterval(() => {
        let _seek = sound.seek();
        const _progress = (_seek / _duration) * 100;
        ipcRenderer.send('progress', _progress);
        setProgress(_progress);
      }, 500);
    }

    // clear the interval timer.
    return () => clearInterval(timer);
  }, [sound]);

  // listen: paused
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

      if (_.isTypedArray(data)) {
        coverImg = `data:${format};base64,${uint8arrayToBase64(data)}`;
      } else {
        coverImg = `data:${format};base64,${data}`;
      }
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
          isPaused={isPaused}
          onClick={handlePause}
        />
      </Left>
      <Right>
        {
          isListVisible
            ?
            <List
              songs={songList}
              onClose={handleList}
              onSelect={handleSelect}
            />
            :
            <Operate
              song={songList && songList[currentIndex]}
              onPrev={handlePrev}
              onPause={handlePause}
              onNext={handleNext}
              onSetting={handleSetting}
              onList={handleList}
              isPaused={isPaused}
              progress={progress}
            />
        }
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
