import React, { useState } from 'react';
import Header from './components/TitleBar';
import Menu from './components/Menu';
import Playing from './pages/Playing';
import Setting from './pages/Setting';
import styled from 'styled-components';

const APP = styled.div``;

const Main = styled.div`
  display: flex;
`;

export type PageName = 'playing' | 'setting';

export default function App() {
  const [page, setPage] = useState<PageName | string>('playing');

  return (
    <APP>
      <Header />
      <Main>
        <Menu onClick={(value) => setPage(value)} />
        <Playing visible={page === 'playing'} />
        <Setting visible={page === 'setting'} />
      </Main>
    </APP>
  );
}
