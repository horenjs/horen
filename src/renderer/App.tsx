/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-19 23:21:35
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \mintin-alo\src\renderer\App.tsx
 * @Description  : 
 */
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from "./pages/home";
import ControlPanel from './components/control-panel';
import Nav, { Group } from './components/nav';
import Library from './pages/library';
import PlayQueue from './components/play-queue';
import { FileDC, PlayerDC }from './data-center';
import { ISong } from '../types';

export interface SetStatusParams {
  index?: number,
  state?: 'load' | 'loaderror' | 'paused' | 'playing' | 'end' | 'stop',
  duration?: number,
}

const MyApp = styled.div`
  display: flex;
  .left {
    min-width: 220px;
    width: 220px;
    background-color: #212223;
    height: 100vh;
  }
  .right {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    .control {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
`;

const NavGroups: Group[] = [
  {
    name: '本地音乐',
    children: [
      {
        name: '最近收听',
        to: '/test-1',
      },
      {
        name: '曲库',
        to: '/library',
      }
    ]
  },
  {
    name: '我的收藏',
    children: [
      {
        name: '最好的声音',
        to: '/test-1',
      },
      {
        name: '摇滚天团之声',
        to: '/test-2',
      }
    ]
  }
]

export default function App () {
  const [playList, setPlayList] = React.useState<ISong[]>([]);
  const [index, setIndex] = React.useState(0);
  const [state, setState] = React.useState('');
  const [seek, setSeek] = React.useState<number>(0);
  const [isQueueOpen, setIsQueueOpen] = React.useState(false);

  // 组件加载时从主进程获取歌曲列表
  React.useEffect(() => {
    (async () => {
      const p = '';
      return;
      /*
      const songPaths = await FileDC.getList(p);
      const songs: PlaySong[] = [];

      for (let songPath of songPaths) {
        const meta = await FileDC.get(songPath);

        const song: PlaySong = {
          ...meta,
          path: songPath,
          howl: null,
          title: meta?.title || songPath.split('\\').pop(),
        }
        songs.push(song);
      }

      setPlayList({id: new Date().valueOf(), children: songs.sort((a, b) => {
        // 使用中文进行排序
        return a.title?.localeCompare(b.title);
      })}); */
    })();
  }, [])

  return (
    <Router>
      <MyApp>
        <div className="left">
          <Nav groups={NavGroups} />
        </div>
        <div className="right">
          <div className="broswer">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route
                path="/library"
                element={
                <Library onAddToPlaylist={(songs) => {
                  const newPlaylist = Array.from(
                    new Set([...playList, ...songs])
                  );
                  setPlayList(newPlaylist);
                  (async () => {
                    const index = await PlayerDC.play(newPlaylist[0].path);
                    setState('playing');
                    setIndex(index);
                  })();
                }} />
                }
              />
            </Routes>
          </div>
          <div className="control">
            <ControlPanel
              song={playList[index]}
              state={state}
              progress={0}
              onPrev={() => {}}
              onPlay={() => {
                (async () => {
                  await PlayerDC.resume(index)
                })();
              }}
              onPause={() => {
                (async () => {
                  await PlayerDC.pause(index);
                  setState('paused');
                })();
              }}
              onNext={() => {}}
              onSeek={(e: any) => {}}
              onQueue={(e) => {
                e.preventDefault();
                setIsQueueOpen(!isQueueOpen);
              }}
            />
          </div>
        </div>
        <PlayQueue
          songs={playList}
          onPlay={(e, i) => {}}
          onClose={() => setIsQueueOpen(!isQueueOpen)}
          playing={playList[index]}
          visible={isQueueOpen}
        />
      </MyApp>
    </Router>
  );
}