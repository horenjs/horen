import React from "react";

import SVG from "./svg-icon";
import CoverAround from './static/image/singlecover.png';
import SongList from "./song-list";
import SongLyric from './song-lyric';


function App() :React.ReactElement {
  const coverImg = `
    https://mintforge-1252473272.cos.ap-nanjing.myqcloud.com/image/img22.jpg
  `;

  const [isSongListVisible, setIsSongListVisible] = React.useState(false);
  const [isLyricVisible, setIsLyricVisible] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <>
      <div className="app-container">
        <div
          className="bg-cover"
          style={{backgroundImage:`url(${coverImg})`}}
        ></div>
        <div className="top title-bar to-drag">
          <div className="toggle-lyric" onClick={e => setIsLyricVisible(!isLyricVisible)}>
            <SVG name="lyric" />
          </div>
          <div className="min-window">
            <SVG name="minus" />
          </div>
          <div className="close-window">
            <SVG name="close" />
          </div>
        </div>
        <div className="left">
          <div
            className="cover"
            onClick={e => setIsSongListVisible(!isSongListVisible)}
            style={{animationPlayState: isPaused ? 'paused' : 'running'}}
          >
            <img src={CoverAround} alt="cover-around" className="cover-around" />
            <img src={coverImg} alt="cover-img" className="cover-image" />
          </div>
        </div>
        <div className="right no-drag">
          <div className="song-info">
            <h3 className="song-title song-item">Thousand Miles Away</h3>
            <p className="song-author song-item">
              Micky Lucky Micky Lucky Micky Lucky
            </p>
          </div>
          <div className="song-operate">
            <SVG name={'prev'} className="prev operate-item" />
            <div
              className="pause operate-item"
              onClick={e => setIsPaused(!isPaused)}
            >
              <SVG name={isPaused ? 'play' : 'pause'} />
            </div>
            <SVG name={'next'} className="next operate-item" />
            <SVG name={'random'} className="random operate-item" />
          </div>
          <div className="song-progress">
            <div className="toplay"></div>
            <div className="played"></div>
          </div>
        </div>
      </div>
      { isSongListVisible && <SongList /> }
      { isLyricVisible && <SongLyric /> }
    </>
  );
}

export default App;
