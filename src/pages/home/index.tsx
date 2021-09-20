import { ISong } from "@/types";
import React from "react";
import styled from 'styled-components';
import _ from 'lodash';
// electron
const electron = window.require('electron');
const { ipcRenderer } = electron;

import { Howl, Howler } from 'howler';

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
  overflow: hidden;
`;

const Top = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 600px;
  height: 24px;
  cursor: pointer;
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
  const [currentSound, setCurrentSound] = React.useState<Howl>(null);
  // lock, when sound is not initialized.
  const [lock, setLock] = React.useState(true);
  // song player status
  const [playOrder, setPlayOrder] = React.useState('random');
  const [playHistory, setPlayHistory] = React.useState<ISong[]>([]);
  
  const [songList, setSongList] = React.useState<ISong[]>();
  const [currentSong, setCurrentSong] = React.useState<ISong>();

  const [progress, setProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(true);
  const [isLoop, setIsLoop] = React.useState(false);
  
  // lyric & list panel
  // const [isLyricVisible, setIsLyricVisible] = React.useState(false);
  const [isListVisible, setIsListVisible] = React.useState(false);
  const [isListVisibleRightnow, setIsListVisibleRightnow] = React.useState(false);
  
  /******************************************************************************/
  /**
   * handle the song play
   * @param e React.MouseEvent
   */
  const handlePrev = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // todo: it's not the perfect way to play prev song.
    setCurrentSong(playHistory[1]);
  }

  const handlePause = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    currentSound && setIsPaused(!isPaused);
  }

  const handleNext = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (currentSong && songList && !lock) {
      const nextSong = getNextSong(currentSong, songList, playOrder);
      console.log('next song: ', nextSong);
      setCurrentSong(nextSong);
      setPlayHistory([nextSong, ...playHistory]);
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

    const currentStatus = {
      currentSong,
      playOrder,
      playHistory,
      songList,
      progress,
      isPaused,
      isLoop,
      isListVisible,
    }
    ipcRenderer.send('userData:write', currentStatus)
    setTimeout(() => ipcRenderer.send('mainWindow:close'), 500);
  }
  /******************************************************************************/

  const handleSelect = (e: React.MouseEvent<HTMLElement>, s: ISong, flag='single') => {
    e.preventDefault();
    setCurrentSong(s);
    setPlayHistory([s, ...playHistory]);

    if (flag === 'double') {
      setIsListVisible(false);
      setIsListVisibleRightnow(false);
    }
  }

  // 监听：读取多个文件
  React.useEffect(() => {
    ipcRenderer.on('file:open=>reply', (event: any, songs: ISong[]) => {
      console.log('read the songs: ', songs);
      if (songs) {
        const song = songs[0];
        setCurrentSong(song);
        setIsPaused(false);
        setPlayHistory([song, ...playHistory]);
        setSongList(songs);
      }
    })

    ipcRenderer.send('userData:read');
    ipcRenderer.on('userData:read=>reply', (event: any, args: any) => {
      console.log(args);
      
      args.playOrder && setPlayOrder(args.playOrder);
      args.playHistory && setPlayHistory(args.playHistory);
      args.songList && setSongList(args.songList);
      args.progress !== undefined && setProgress(args.progress);
      args.isPaused !== undefined && setIsPaused(args.isPaused);
      args.isLoop !== undefined && setIsLoop(args.isLoop);
      args.isListVisible !== undefined && setIsListVisible(args.isListVisible);

      args.currentSong && setCurrentSong(args.currentSong);
    })
  }, [])

  // listening: current song change
  React.useEffect(() => {
    if (currentSong) {
      // console.log('play history: ', ...playHistory);

      const sound = new Howl({src: [currentSong.path]});

      if (currentSound) {
        // 切换歌曲时，先锁定，避免频繁切换
        setLock(true);

        currentSound.unload();

        sound.once('load', () => {
          if (currentSound.state() === 'unloaded') {
            console.log('old sound unloaded.')
            setCurrentSound(sound);
            setLock(false); // release the lock while playing
            
            sound.play();
          }
        });
      } else {
        sound.once('load', () => {
          setCurrentSound(sound);
          setLock(false); // release the lock while playing
          
          sound.play();
        })
      }

      // set the main window title.
      const { title, artist } = currentSong.common;
      const t = _.join([title, artist], ' - ');
      // console.log(t);
      ipcRenderer.send('mainWindow:setTitle', t);
    }
  }, [currentSong])

  // listening: current sound change
  React.useEffect(() => {
    if (currentSound && currentSong && songList) {
      currentSound.on('end', () => {
        const nextSong = getNextSong(currentSong, songList, playOrder);
        console.log('current sound end, next: ', nextSong);
        setCurrentSong(nextSong);
        setPlayHistory([nextSong, ...playHistory]);
      })
    }

    if (currentSound) {
      let timer = setInterval(() => {
        const _seek = currentSound.seek();
        const _duration = currentSound.duration();
        const _progress = (_seek / _duration) * 100;
        setProgress(_progress);
        ipcRenderer.send('mainWindow:setProgressBar', _progress);
      }, 500);

      return () => clearInterval(timer);
    }
  }, [currentSound])

  // listening: pause or play
  React.useEffect(() => {
    if (currentSound) {
      isPaused ? currentSound.pause() : currentSound.play();
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
          source={currentSong ? getCoverImgStr(currentSong) : DefaultCover}
          title="song-cover"
          isPaused={isPaused}
          onClick={handlePause}
        />
      </Left>
      <Right>
        {
          isListVisible
            ?
            <div className={classname(isListVisibleRightnow)} style={{width: '100%'}}>
              <List
                songs={songList}
                currentSong={currentSong}
                onClose={e => {
                  setIsListVisibleRightnow(false);
                  setTimeout(() => setIsListVisible(false), 260);
                }}
                onSelect={handleSelect}
                onDoubleSelect={(e, s) => handleSelect(e, s, 'double')}
              />
            </div>
            :
            <Operate
              song={currentSong}
              onPrev={handlePrev}
              onPause={handlePause}
              onNext={handleNext}
              onSetting={handleSetting}
              onList={e => {
                setIsListVisibleRightnow(true);
                setIsListVisible(true);
              }}
              isPaused={isPaused}
              progress={progress}
            />
        }
      </Right>
    </Container>
  );
}

function classname (isTrue: boolean) {
  return isTrue ? 'slideInRight' : 'slideOutRight';
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

const getNextSong = (current: ISong, songList: ISong[], order = 'asc') :ISong => {
  let i = 0;
  let index = 0;

  for (let j = 0; j < songList.length; j ++) {
    if (current.path === songList[j].path) {
      index = j;
    }
  }

  switch (order) {
    case 'asc':
      if (index < songList.length - 1) {
        i = index + 1;
      }
      break;
    case 'random':
      i = randomInteger(0, songList.length - 1);
      if (i === index) {
        return getNextSong(current, songList, order);
      }
      break;
  }

  console.log(`i: ${i} <=> index: ${index}`);

  return songList[i];
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
