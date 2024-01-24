import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  openDialog,
  writeSetting,
  writeLibraries,
  readSetting,
  refreshTrackList,
  readLibraries,
} from '../api';

const SETTING = styled.div``;

const SettingItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  label {
    width: 80px;
    color: #fff;
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: right;
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

export type SettingProps = {
  visible?: boolean;
};

export type SettingItemProps = {
  label: string;
  children: React.ReactNode;
};

export default function Setting(props: SettingProps) {
  const { visible } = props;
  const [libraries, setLibraries] = useState<any[]>([]);
  const [language, setLanguage] = useState<string>('en');

  const handleAdd = () => {
    openDialog().then((res: any) => {
      if (!res.canceled) {
        const filePaths: string[] = res.filePaths;
        const newLibs = [
          ...libraries,
          ...filePaths.filter((lib) => !libraries.includes(lib)),
        ];
        setLibraries(newLibs);
        writeLibraries(newLibs);
      }
    });
  };

  const handleDelete = (lib: string) => {
    const newLibs = [...libraries];
    const libs = newLibs.filter((l) => l !== lib);
    setLibraries(libs);
    writeLibraries(libs);
  };

  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    writeSetting('language', e.target.value);
  };

  const handleRefresh = () => {
    refreshTrackList().then();
  };

  useEffect(() => {
    readSetting('language').then((value) => setLanguage(value));
    readLibraries().then((libs) => {
      if (libs instanceof Array) setLibraries(libs);
    });
  }, []);

  return (
    <SETTING style={{ display: visible ? 'block' : 'none' }}>
      <Item label="libraries">
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
        <button onClick={handleAdd}>Add Path to Libraries</button>
        <button onClick={handleRefresh}>Refresh Track List</button>
      </Item>
      <Item label="Language">
        <select value={language} onChange={handleChangeLang}>
          <option value="cn">Chinese</option>
          <option value="en">English</option>
        </select>
      </Item>
    </SETTING>
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
