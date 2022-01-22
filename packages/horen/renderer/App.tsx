/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-22 14:21:32
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\App.tsx
 * @Description  :
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Player from 'horen-plugin-player';
import ControlPanel from './components/control-panel';
import Library from './pages/library';
import { PlayQueue } from './components/play-queue';
import styled from 'styled-components';

const libraryPaths = [
  'D:\\Music\\林俊杰合集\\2010 林俊杰 - 她说',
  'D:\\Music\\流行音乐\\李荣浩',
];

export default function App() {
  const [player, setPlayer] = React.useState(new Player());
  const [progress, setProgress] = React.useState(0);
  const [isQueue, setIsQueue] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((player.seek / player.duration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [progress]);

  return (
    <MyApp className='app'>
      <Router>
        <div className="pages">
          <Routes>
            <Route path="/">
              <Route
                index
                element={
                  <Library
                    tracks={player.trackList}
                    paths={libraryPaths}
                    onAddTo={(tracks) => {
                      console.log(tracks);
                      player.trackList = player.trackList.concat(tracks);
                    }}
                  />
                }
              />
            </Route>
          </Routes>
        </div>
        <ControlPanel
          track={player.currentTrack}
          playing={player.playing}
          onPrev={() => player.skip('prev')}
          onPlayOrPause={() => player.playOrPause()}
          onNext={() => {
            player.skip('next');
            console.log(player.historyList);
          }}
          onSeek={(per) => (player.seek = per * player.duration)}
          progress={progress}
          plugin={
            <div
              className="control-panel-plugin-queue"
              role="button"
              onClick={() => setIsQueue(true)}
            >
              <div>打开队列</div>
              <span>{player.trackList.length} 首歌曲</span>
            </div>
          }
        />
        <PlayQueue
          tracks={player.trackList}
          track={player.currentTrack}
          visible={isQueue}
          onPlay={(track) => (player.currentTrack = track)}
          onClose={() => setIsQueue(false)}
        />
      </Router>
    </MyApp>
  );
}

const MyApp = styled.div`
  .control-panel-plugin-queue {
    cursor: pointer;
    user-select: none;
    text-align: center;
    div {
      font-size: 0.8rem;
    }
    span {
      font-size: 0.6rem;
    }
  }
`;
