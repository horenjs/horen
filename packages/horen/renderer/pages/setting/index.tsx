/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 15:16:09
 * @LastEditTime : 2022-01-27 18:44:19
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\pages\setting\index.tsx
 * @Description  : setting page
 */
import React from 'react';
import styled from 'styled-components';
import { Loader } from '@/components/loader';
import SettingGroup from './setting-group';
import { settingState } from '@/store';
import { useRecoilState } from 'recoil';
import { SettingDC } from '../../data-center';

export default function SettingPage() {
  const [setting, setSetting] = useRecoilState(settingState);

  return (
    <MySetting className="setting-page">
      {setting?.groups ? (
        setting.groups.map((group, index) => {
          return (
            <div className={`setting-group-${group.name}`} key={group.name}>
              <h1 style={{ padding: '0 0 0 40px' }}>{group.name}</h1>
              <SettingGroup
                group={group}
                onChange={async (newGroup) => {
                  const groups = [...setting.groups];
                  groups[index] = newGroup;
                  setSetting({...setting, groups});
                  await SettingDC.set({ ...setting, groups });
                }}
              />
            </div>
          );
        })
      ) : (
        <Loader style="square" />
      )}
    </MySetting>
  );
}

const MySetting = styled.div`
  color: #c1c2c3;
  .setting-item {
    display: flex;
    align-items: center;
    margin: 16px 0;
    flex-wrap: wrap;
    span {
      display: inline-block;
      &.label {
        width: 180px;
        text-align: right;
        margin-right: 32px;
      }
      &.value {
        font-size: 0.9rem;
        color: #a1a2a3;
      }
    }
  }
`;
