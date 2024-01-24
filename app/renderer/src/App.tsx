import React, { useState } from 'react';
import Header from './components/TitleBar';
import Menu from './components/Menu';
import Player from './components/Player';
import PlayList from './pages/PlayList';
import Setting from './pages/Setting';
import TrackList from './pages/TrackList';
import styled from 'styled-components';
import PlayContext, { HorenContext } from './components/PlayContext';

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

export type PageName = 'playing' | 'setting';

export default function App() {
  const [page, setPage] = useState<PageName | string>('playing');

  return (
    <PlayContext>
      <APP>
        <Top className="app-top electron-drag">
          <Header />
        </Top>
        <Main className="app-main">
          <Menu onClick={(value) => setPage(value)} />
          <Page className="page-container">
            <PlayList visible={page === '播放列表'} />
            <Setting visible={page === '设置'} />
            <TrackList visible={page === '全部'} />
          </Page>
        </Main>
        <Bottom className="app-bottom">
          <Player />
        </Bottom>
      </APP>
    </PlayContext>
  );
}

export { HorenContext };
