import React from "react";

import SVG from "./svg-icon";

function App() :React.ReactElement {
  const coverImg = `
    https://mintforge-1252473272.cos.ap-nanjing.myqcloud.com/image/img22.jpg
  `;

  return (
    <div className="app-container">
      <div className="top title-bar to-drag">
        <div className="close-window">
          <SVG
            name="close-light"
            onClick={e => {
              e.preventDefault();
            }}
          />
        </div>
      </div>
      <div className="left">
        <div className="cover">
          <img src={coverImg} alt="cover-img" />
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
          <SVG name={'pause'} className="pause operate-item" />
          <SVG name={'next'} className="next operate-item" />
          <SVG name={'random'} className="random operate-item" />
        </div>
        <div className="song-progress">
          <div className="toplay"></div>
          <div className="played"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
