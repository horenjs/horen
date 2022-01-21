/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-13 23:01:58
 * @LastEditTime : 2022-01-21 19:59:28
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\App.tsx
 * @Description  :
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Player from 'horen-plugin-player';

export default function App() {
  // todo: should use the absolute path.
  const src = ['C:\\Projects\\Horen\\test.mp3'];

  const [player, setPlayer] = React.useState(new Player());

  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    player.trackList = [{ id: 1, src: src[0] }];
                    console.log(player.trackList);
                  }}
                >
                  load track and play
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    player.playOrPause();
                    console.log(player.playing);
                  }}
                >
                  Play Or Pause
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    player.progress = 50;
                  }}
                >
                  seek 50
                </button>
                <div>current seek: { player.progress }</div>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
