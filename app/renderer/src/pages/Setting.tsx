import React, { useState } from 'react';
import styled from 'styled-components';
import { openDialog, setSetting } from '../api';

const SETTING = styled.div``;

export type SettingProps = {
  visible?: boolean;
};

export default function Setting(props: SettingProps) {
  const { visible } = props;
  const [libraries, setLibraries] = useState<any[]>([]);
  const [name, setName] = useState<string>('');

  const handleAdd = () => {
    openDialog().then((res: any) => {
      if (!res.canceled) {
        const newLibs = [...libraries, ...res.filePaths];
        setLibraries(newLibs);
        setSetting('libraries', newLibs);
      }
    });
  };

  return (
    <SETTING style={{ display: visible ? 'block' : 'none' }}>
      <span>
        {libraries.map((lib) => (
          <div key={lib}>{lib}</div>
        ))}
      </span>
      <button onClick={handleAdd}>add</button>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setSetting('name', e.target.value);
        }}
      />
    </SETTING>
  );
}
