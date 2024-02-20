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

const SETTING = styled.div`
  padding-right: 48px;
  padding-top: 16px;
`;

const MsgModal = styled.div`
  width: 80%;
  max-width: 80%;
  height: 26px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 80px;
  background-color: #3a3a3a;
  padding: 4px 8px;
  overflow: hidden;
  .refresh-msg {
    font-size: 0.7rem;
    overflow: hidden;
    color: #fff;
    font-weight: 300;
    max-width: 100%;
  }
`;

const SettingItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  button {
    background-color: #444;
    border: none;
    color: #cdcdcd;
    padding: 4px 8px;
    margin: 0 4px 0 0;
    &:hover {
      background-color: #636363;
    }
  }
  select {
    background-color: #444;
    border: none;
    padding: 4px 8px;
    color: #cdcdcd;
    outline: none;
    &:hover {
      background-color: #636363;
    }
  }
`;

const ItemLabel = styled.div`
  width: 56px;
  margin-right: 24px;
  label {
    color: #b1b1b1;
    display: inline-block;
    width: inherit;
    text-align: justify;
    text-align-last: justify;
    font-weight: 500;
    font-size: 0.9rem;
  }
`;

const ItemChild = styled.div`
  flex-grow: 1;
  .desc {
    display: inline-block;
    font-size: 0.7rem;
    line-height: 0.8rem;
    margin-top: 8px;
    color: #6b6b6b;
    font-weight: 300;
  }
`;

const Libraries = styled.div`
  background-color: #555;
  min-height: 32px;
  color: #fff;
  padding: 4px 8px;
  font-size: 0.8rem;
  margin-bottom: 8px;
  .delete {
    color: #e31d1d;
    margin-left: 8px;
    user-select: none;
  }
`;

export type SettingPageProps = PageProps;

export type SettingItemProps = {
  label: string;
  desc?: string;
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
        current === total ? '' : `Loading: [ ${current}/${total} ] ${msg}`;
      setFreshMsg(m);
    });

    readDB('setting.libraries').then((libs) => {
      if (libs instanceof Array) setLibraries(libs);
    });
  }, []);

  return (
    <Page visible={visible}>
      <SETTING>
        <Item label="曲  库" desc="重复的文件将不会被添加">
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
          <button onClick={handleAdd}>添加至曲库</button>
          <button onClick={() => handleRefresh()}>更新曲库</button>
          <button onClick={() => handleRefresh(true)}>
            更新曲库（清空缓存）
          </button>
        </Item>
        <Item label="主题色" desc="设置界面主题色">
          <select>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Item>
        <Item label="语  言" desc="设置界面语言">
          <select value={language} onChange={handleChangeLang}>
            <option value="cn">Chinese</option>
            <option value="en">English</option>
          </select>
        </Item>
        <Item label="日志" desc="查看本地日志">
          <button>打开日志文件</button>
        </Item>
      </SETTING>
      {refreshMsg && (
        <MsgModal>
          <div className="refresh-msg single-line">{refreshMsg}</div>
        </MsgModal>
      )}
    </Page>
  );
}

function Item({ label, desc, children }: SettingItemProps) {
  return (
    <SettingItem>
      <ItemLabel>
        <label>{label}</label>
      </ItemLabel>
      <ItemChild>
        <div>{children}</div>
        <div className="desc">{desc}</div>
      </ItemChild>
    </SettingItem>
  );
}
