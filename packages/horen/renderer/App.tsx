/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-22 13:49:04
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\App.tsx
 * @Description  :
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Player from 'horen-plugin-player';
import ControlPanel from './components/control-panel';
import Library from './pages/library';

const libraryPaths = [
  'D:\\Music\\林俊杰合集\\2010 林俊杰 - 她说',
  'D:\\Music\\流行音乐\\李荣浩'
]

export default function App() {
  const [player, setPlayer] = React.useState(new Player());
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((player.seek / player.duration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [progress]);

  return (
    <Router>
      <div className="pages">
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <Library
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
      />
    </Router>
  );
}
