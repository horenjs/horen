import React, { useState, createContext } from 'react';
import Header from './components/TitleBar';
import Menu from './components/Menu';
import Player from './components/Player';
import Playing from './pages/Playing';
import Setting from './pages/Setting';
import PlayList from './pages/PlayList';
import styled from 'styled-components';
import { HowlPlayer } from './utils';
import { Track, getFile } from './api';

const APP = styled.div`
  min-width: 800px;
`;

const Top = styled.div`
  min-width: 800px;
  position: fixed;
  top: 0px;
  width: 100%;
  left: 0;
`;

const Main = styled.div`
  height: calc(100vh - 96px);
  width: 100%;
  background-color: #333;
  min-width: 800px;
`;

const Bottom = styled.div`
  min-width: 800px;
  height: 64px;
`;

const Page = styled.div`
  padding: 48px;
  height: calc(100vh - 136px);
`;

interface IHorenContext {
  player: {
    add: (track: Track) => void;
    remove: (track: Track) => void;
    play: (track: Track) => void;
    next: () => void;
    prev: () => void;
    trackList: Track[];
    currentTrack: Track | null;
  };
}

const player = new HowlPlayer<Track>();

export const HorenContext = createContext<IHorenContext>({
  player: {
    add: () => {},
    remove: () => {},
    play: () => {},
    next: () => {},
    prev: () => {},
    trackList: [],
    currentTrack: null,
  },
});

export type PageName = 'playing' | 'setting';

export default function App() {
  const [page, setPage] = useState<PageName | string>('playing');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [trackList, setTrackList] = useState<Track[]>([]);

  const play = (track: Track) => {
    console.log(trackList);
    setCurrentTrack(track);

    getFile(track.src).then((res) => {
      player.currentTrack = { ...track, src: res };
    });

    if (!includes(trackList, track)) {
      setTrackList((prev) => [...prev, track]);
    }
  };

  const add = (track: Track) => {
    if (!includes(trackList, track)) setTrackList((prev) => [...prev, track]);
  };

  const remove = (track: Track) => {
    setTrackList((prev) => prev.filter((t) => t.title !== track.title));
  };

  const next = () => {
    if (currentTrack) {
      const idx = trackList.indexOf(currentTrack);
      const length = trackList.length;
      if (idx < length - 1) {
        play(trackList[idx + 1]);
      }
    }
  };

  const prev = () => {
    if (currentTrack) {
      const idx = trackList.indexOf(currentTrack);
      if (idx > 0) {
        play(trackList[idx - 1]);
      }
    }
  };

  return (
    <HorenContext.Provider
      value={{
        player: { add, play, remove, prev, next, currentTrack, trackList },
      }}
    >
      <APP>
        <Top className="app-top electron-drag">
          <Header />
        </Top>
        <Main className="app-main">
          <Menu onClick={(value) => setPage(value)} />
          <Page className="page-container">
            <Playing visible={page === '列表'} />
            <Setting visible={page === '设置'} />
            <PlayList visible={page === '歌曲'} />
          </Page>
        </Main>
        <Bottom className="app-bottom">
          <Player />
        </Bottom>
      </APP>
    </HorenContext.Provider>
  );
}

const includes = (tracks: Track[], track: Track) => {
  for (const t of tracks) {
    if (t.title === track.title) return true;
  }
};
