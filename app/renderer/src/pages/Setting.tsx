import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  openDialog,
  refreshTrackList,
  refreshTrackListMsg,
  readDB,
  writeDB,
} from '../api';
import Page, { PageProps } from './_page';
import { HorenContext } from '../components/PlayContext';

const SETTING = styled.div``;

const SettingItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  .refresh-msg {
    height: 18px;
  }
  label {
    width: 80px;
    color: #fff;
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .refresh-msg {
    font-size: 0.8rem;
    margin-bottom: 8px;
    max-width: 100%;
    overflow: hidden;
    color: #fff;
    font-weight: 300;
  }
`;

const ItemChild = styled.div`
  flex-grow: 1;
`;

const Libraries = styled.div`
  background-color: #555;
  min-height: 32px;
  color: #fff;
  padding: 4px 8px;
  font-size: 0.8rem;
  .delete {
    color: #e31d1d;
    margin-left: 8px;
    user-select: none;
  }
`;

export type SettingPageProps = PageProps;

export type SettingItemProps = {
  label: string;
  children: React.ReactNode;
};

export default function Setting(props: SettingPageProps) {
  const { visible } = props;
  const [libraries, setLibraries] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>('en');
  const [refreshMsg, setFreshMsg] = useState<string>('');
  const { setToTrackList } = useContext(HorenContext);

  const handleAdd = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openDialog().then((res: any) => {
      if (!res.canceled) {
        const filePaths: string[] = res.filePaths;
        const newLibs = [
          ...libraries,
          ...filePaths.filter((lib) => !libraries.includes(lib)),
        ];
        setLibraries(newLibs);
        writeDB('setting.libraries', newLibs);
      }
    });
  };

  const handleDelete = (lib: string) => {
    const newLibs = [...libraries];
    const libs = newLibs.filter((l) => l !== lib);
    setLibraries(libs);
    writeDB('setting.libraries', libs);
  };

  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    writeDB('setting.language', e.target.value);
  };

  const handleRefresh = (clearCache = false) => {
    (async () => {
      await refreshTrackList({ clearCache });
      const tracks = await readDB('tracks');
      setToTrackList(tracks);
    })();
  };

  useEffect(() => {
    readDB('setting.language').then((value) => setLanguage(value));

    refreshTrackListMsg((evt, current, total, msg) => {
      const m =
        current === total ? '' : `READDING: [${current}/${total}] ${msg}`;
      setFreshMsg(m);
    });

    readDB('setting.libraries').then((libs) => {
      if (libs instanceof Array) setLibraries(libs);
    });
  }, []);

  return (
    <Page visible={visible}>
      <SETTING style={{ display: visible ? 'block' : 'none' }}>
        <Item label="曲  库">
          <div className="refresh-msg">{refreshMsg}</div>
          <Libraries>
            {libraries?.map((lib) => (
              <div key={lib}>
                <span>{lib}</span>
                <span className="delete" onClick={() => handleDelete(lib)}>
                  x
                </span>
              </div>
            ))}
          </Libraries>
          <button onClick={handleAdd}>添加至库</button>
          <button onClick={() => handleRefresh()}>更新列表</button>
          <button onClick={() => handleRefresh(true)}>
            清空缓存并更新列表
          </button>
        </Item>
        <Item label="语  言">
          <select value={language} onChange={handleChangeLang}>
            <option value="cn">Chinese</option>
            <option value="en">English</option>
          </select>
        </Item>
      </SETTING>
    </Page>
  );
}

function Item({ label, children }: SettingItemProps) {
  return (
    <SettingItem>
      <label>{label}</label>
      <ItemChild>{children}</ItemChild>
    </SettingItem>
  );
}
