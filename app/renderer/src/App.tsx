import React, { useState } from 'react';
import Header from './components/TitleBar';
import Menu from './components/Menu';
import Player from './components/Player';
import Playing from './pages/Playing';
import Setting from './pages/Setting';
import PlayList from './pages/PlayList';
import styled from 'styled-components';

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
    <APP>
      <Top className="app-top">
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
  );
}
