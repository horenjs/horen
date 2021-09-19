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
  const [playHistory, setPlayHistory] = React.useState<ISong[]>([]);
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [coverImgStr, setCoverImgStr] = React.useState(DefaultCover);
  // 
  const [songList, setSongList] = React.useState<ISong[]>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  // lyric & list panel
  const [isLyricVisible, setIsLyricVisible] = React.useState(false);
  const [isListVisible, setIsListVisible] = React.useState(false);
  
  /******************************************************************************/
  /**
   * handle the song play
   * @param e React.MouseEvent
   */
  const handlePrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (songList && playHistory.length >= 2) {
      const prevSong = playHistory[historyIndex];
      const prevIndex = _.indexOf(songList, prevSong);

      console.log('prev song: ', prevSong);
      console.log('prev song index: ', prevIndex);

      setCurrentIndex(prevIndex);
      destoryAndCreateSound(prevSong);
      setHistoryIndex(historyIndex + 1);
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
      const nextIndex = getNextIndex();

      const nextSong = songList[nextIndex];

      setCurrentIndex(nextIndex);
      destoryAndCreateSound(nextSong);

      // 每次播放新的歌曲时，将其加入历史播放列表
      setPlayHistory([nextSong, ...playHistory]);
      setHistoryIndex(0);

      console.log([nextSong, ...playHistory]);
    }
  }
  /*******************************************************************************/

  const handleSetting = (e: React.MouseEvent<HTMLElement>, flag: string) => {
    e.preventDefault();
    switch (flag) {
      case 'open-files':
        ipcRenderer.send('file:open', {flag});
        break;
    }
  }

  /******************************************************************************/
  /**
   * handle the main window CLOSE or MINIMIZE
   * @param e React.MouseEvent
   */
  const handleMinimize = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    ipcRenderer.send('mainWindow:minimize');
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

    ipcRenderer.send('mainWindow:close', {status});
  }
  /******************************************************************************/

  const handleList = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsListVisible(!isListVisible);
  }

  const handleSelect = (e: React.MouseEvent<HTMLElement>, s: ISong) => {
    e.preventDefault();
    
    const selectedIndex = songList.indexOf(s);

    const selectedSong = songList[selectedIndex];

    setCurrentIndex(selectedIndex);
    destoryAndCreateSound(selectedSong);

    setPlayHistory([selectedSong, ...playHistory]);
    setHistoryIndex(0);
  }

  const getNextIndex = () => {
    let i = 0;

    switch (playOrder) {
      case 'asc':
        if (currentIndex < songList.length - 1) {
          i = currentIndex + 1;
        }
        break;
      case 'random':
        const nextIndex = randomInteger(0, songList.length - 1);

        console.log('next song index: ', nextIndex);

        i = nextIndex;
        break;
    }

    return i;
  }

  /**
   * if song existed, destory it, then create new song.
   * @param song ISong
   * @returns new sound
   */
  const destoryAndCreateSound = (song: ISong) => {
    if (sound) {
      sound.unload();
      setSound(undefined);
    }

    // set progress to 0, make song switch naturaly.
    setProgress(0);

    const src = song.path;
    const newSound = new Howl({src, autoplay: true});

    setSound(newSound);

    return newSound;
  }

  // 监听：读取多个文件
  React.useEffect(() => {
    ipcRenderer.on('file:open=>reply', (event: any, songs: ISong[]) => {
      console.log('read the songs: ', songs);

      if (songs.length !== 0) {
        setSongList(songs);

        const newSong = songs[0];
        destoryAndCreateSound(newSong);
      }
    });
  }, [])

  /* listening: init the app 
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
        const storedSong = args.songList[args.currentIndex];
        const newSound = destoryAndCreateSound(storedSong);

        // 恢复上次播放的时间
        if (args.progress) {
          newSound.seek(args.progress);
        }
      }
    })
  }, []) */

  // listen: sound
  React.useEffect(() => {
    let timer: any;

    if (sound && songList) {
      // get the duration of song after loaded.
      let _duration = 0;

      // when sound is loaded.
      sound.once('load', () => {
        _duration = sound.duration();

        // set the main window title
        const song = songList[currentIndex];
        const title = song.common.title + ' - ' + song.common.artist;
        ipcRenderer.send('mainWindow:setTitle', title);

        // set the cover
        setCoverImgStr(getCoverImgStr(song));
      })

      // when sound is end, go to the next
      sound.once('end', () => {
        if (currentIndex < songList.length - 1) {
          const nextIndex = getNextIndex();
          const newSong = songList[currentIndex];

          setCurrentIndex(nextIndex);
          destoryAndCreateSound(newSong);

          setPlayHistory([newSong, ...playHistory]);
          setHistoryIndex(0);
        }
      });

      // update progess per second.
      timer = setInterval(() => {
        let _seek = sound.seek();

        const _progress = (_seek / _duration) * 100; // 0 - 100

        // console.log('current progress: ', _progress);

        ipcRenderer.send('mainWindow:setProgressBar', _progress);

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
          source={coverImgStr}
          title="song-cover"
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

function getCoverImgStr(song: ISong) {
  let cover = '';

  const { common } = song;
  const { picture } = common;

  if (picture) {
    const { format, data } = picture[0];

    if (_.isTypedArray(data)) {
      cover = `data:${format};base64,${uint8arrayToBase64(data)}`;
    } else {
      cover = `data:${format};base64,${data}`;
    }
  }

  return cover;
}

export default App;
