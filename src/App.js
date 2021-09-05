import React from 'react';

import './App.css';
import prev from './icons/prev.svg';
import prevLight from './icons/prev-light.svg';
import next from './icons/next.svg';
import nextLight from './icons/next-light.svg';
import pause from './icons/pause.svg';
import pauseLight from './icons/pause-light.svg';
import random from './icons/random.svg';
import randomLight from './icons/random-light.svg';
import close from './icons/close.svg';


function App() {
  const coverImg = `
    https://mintforge-1252473272.cos.ap-nanjing.myqcloud.com/image/img22.jpg
  `;

  const [isPrevHover, setIsPrevHover] = React.useState(false);
  const [isNextHover, setIsNextHover] = React.useState(false);
  const [isPauseHover, setIsPauseHover] = React.useState(false);
  const [isOrderHover, setIsOrderHover] = React.useState(false);

  function handleMouseEnter(e, flag) {
    switch (flag) {
      case 'prev':
        setIsPrevHover(true);
        break;
      case 'pause':
        setIsPauseHover(true);
        break;
      case 'next':
        setIsNextHover(true);
        break;
      case 'play-order':
        setIsOrderHover(true);
        break;
      default:
        break;
    }
  }

  function handleMouseLeave(e, flag) {
    switch (flag) {
      case 'prev':
        setIsPrevHover(false);
        break;
      case 'pause':
        setIsPauseHover(false);
        break;
      case 'next':
        setIsNextHover(false);
        break;
      case 'play-order':
        setIsOrderHover(false);
        break;
      default:
        break;
    }
  }

  return (
    <div className="App">
      <div className="top title-bar to-drag">
        <img
          src={close}
          alt="close-window"
          className="close-window no-drag"
          onClick={e => {
            e.preventDefault();
            // ipcRenderer.send('close-window', 'ping')
          }}
        />
      </div>
      <div className="left">
        <div className="cover">
          <img src={coverImg} alt="cover-img" />
        </div>
      </div>
      <div className="right no-drag">
        <div className="song-info">
          <h3 className="song-title song-item">Thousand Miles Away</h3>
          <p className="song-author song-item">Micky Lucky Micky Lucky Micky Lucky</p>
        </div>
        <div className="song-operate">
          <img
            src={isPrevHover ? prevLight : prev}
            alt="prev"
            className="prev"
            onMouseEnter={e => handleMouseEnter(e, 'prev')}
            onMouseLeave={e => handleMouseLeave(e, 'prev')}
          />
          <img
            src={isPauseHover ? pauseLight : pause}
            alt="pause"
            className="pause"
            onMouseEnter={e => handleMouseEnter(e, 'pause')}
            onMouseLeave={e => handleMouseLeave(e, 'pause')}
          />
          <img
            src={isNextHover ? nextLight : next}
            alt="next"
            className="next"
            onMouseEnter={e => handleMouseEnter(e, 'next')}
            onMouseLeave={e => handleMouseLeave(e, 'next')}
          />
          <img
            src={isOrderHover ? randomLight : random}
            alt="play-order"
            className="play-order"
            onMouseEnter={e => handleMouseEnter(e, 'play-order')}
            onMouseLeave={e => handleMouseLeave(e, 'play-order')}
          />
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
