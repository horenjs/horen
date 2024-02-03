import React, { useState } from 'react';
import Header from './components/TitleBar';
import Menu from './components/Menu';
import Player from './components/Player';
import PlayList from './pages/PlayList';
import Setting from './pages/Setting';
import TrackList from './pages/TrackList';
import { AlbumListPage } from './pages/AlbumList';
import { ArtistListPage } from './pages/ArtistList';
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
  z-index: 1;
`;

const Main = styled.div`
  height: calc(100vh - 72px - 64px);
  padding-right: 8px;
  margin-top: 72px;
  width: 100%;
  background-color: #333;
  min-width: 800px;
`;

const Bottom = styled.div`
  min-width: 800px;
  height: 64px;
`;

const PageContainer = styled.div`
  padding: 8px 32px 8px 48px;
  height: calc(100vh - 140px);
  width: 100%;
  overflow-y: auto;
`;

export type PageName = 'playing' | 'setting';

export default function App() {
  const [page, setPage] = useState<PageName | string>('全部');

  const pages: Record<string, React.ReactNode> = {
    播放列表: <PlayList visible={page === '播放列表'} />,
    设置: <Setting visible={page === '设置'} />,
    全部: <TrackList visible={page === '全部'} />,
    专辑: <AlbumListPage visible={page === '专辑'} />,
    艺术家: <ArtistListPage visible={page === '艺术家'} />,
  };

  return (
    <PlayContext>
      <APP>
        <Top className="app-top electron-drag">
          <Header />
          <Menu onClick={(value) => setPage(value)} />
        </Top>
        <Main className="app-main">
          <PageContainer className="page-container perfect-scrollbar">
            {pages[page]}
          </PageContainer>
        </Main>
        <Bottom className="app-bottom">
          <Player />
        </Bottom>
      </APP>
    </PlayContext>
  );
}

export { HorenContext };
