/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-22 02:24:46
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\App.tsx
 * @Description  :
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Player from 'horen-plugin-player';
import ControlPanel from './components/control-panel';
import Library from './pages/library';

export default function App() {
  // todo: should use the absolute path.
  const srcs = [
    {
      id: 1,
      src: 'D:\\Music\\流行音乐\\刘惜君\\当我身边空无一人\\刘惜君 - .就算了吗.flac',
    },
    {
      id: 2,
      src: 'D:\\Music\\流行音乐\\刘惜君\\当我身边空无一人\\刘惜君 - .你的手.flac',
    },
    {
      id: 3,
      src: 'D:\\Music\\流行音乐\\刘惜君\\当我身边空无一人\\刘惜君 - .鱼的记忆.flac',
    },
    {
      id: 4,
      src: 'D:\\Music\\流行音乐\\刘惜君\\当我身边空无一人\\刘惜君 - .多傻.flac',
    },
    {
      id: 5,
      src: 'D:\\Music\\流行音乐\\刘惜君\\当我身边空无一人\\刘惜君 - .光.flac',
    },
    {
      id: 6,
      src: 'D:\\Music\\流行音乐\\刘惜君\\当我身边空无一人\\刘惜君 - .后来我们会怎样.flac',
    },
  ];

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
                  onAddToPlaylist={(tracks) => {
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
