/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 15:16:09
 * @LastEditTime : 2022-01-28 16:55:48
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\src\horen\renderer\pages\setting\index.tsx
 * @Description  : setting page
 */
import React from 'react';
import styled from 'styled-components';
import { settingState } from '@/store';
import { useRecoilState } from 'recoil';
import { SettingDC, DialogDC } from '@/data-center';
import {SettingFile } from 'types';
import {LANG, THEME} from 'constant';
import Switch from "@/components/switch";
import { Loader } from '@/components/loader';
import SettingItem from "./setting-item";

export interface ISettingItem {
  key: string,
  group: string,
  label: string,
  value: string | string[] | number | number[] | boolean,
}

export default function SettingPage() {
  const [setting, setSetting] = useRecoilState(settingState);

  const handleSettingChange = async () => {
    await SettingDC.set(setting);
  }

  React.useEffect(() => {
    (async () => await handleSettingChange())();
  }, [setting]);
  
  const renderSettingItem = (st: SettingFile) => {
    const items: ISettingItem[] = [];
    
    for (const key in st) {
      const parts = key.split('.');
      if (parts.length === 2) items.push({
        key: key,
        group: parts[0],
        label: parts[1],
        value: st[key],
      })
    }
    
    return (
      <div className={'setting-container electron-no-drag'}>
        {items.map(item => {
          let el: React.ReactNode;
          
          if (item.value instanceof Array) {
            el = (
              <div className={'setting-item-value'}>
                {item.value.map((v, index) => {
                  return (
                    <div key={v}>
                      <span>{v}</span>
                      <span
                        role={'button'}
                        style={{marginLeft:8, color: THEME.color.error}}
                        onClick={e => {
                          e.preventDefault();
                          const newSt = {...setting};
                          const value = [...(item.value as string[])];
                          value.splice(index, 1);
                          newSt[item.key] = value;
                          setSetting(newSt);
                        }}>✖</span>
                    </div>
                  )
                })}
                <div
                  className={'add-value'}
                  style={{fontSize:'1.4rem'}}
                  role={'button'}
                  onClick={async (e) => {
                    e.preventDefault();
                    const res = await DialogDC.open();
                    const filePaths = res.filePaths;
                    const newSt = {...setting};
                    newSt[item.key] = [...item.value as string[], ...filePaths];
                    setSetting(newSt);
                  }}>{ LANG.operate['add'] }</div>
              </div>
            )
          }
          
          if (typeof item.value === 'string' || typeof item.value === 'number') el = <span>{ item.value }</span>;
          
          if (typeof item.value === 'boolean') {
            el = <Switch on={item.value} onChange={(on) => {
              const newSt = {...setting};
              newSt[item.key] = on;
              setSetting(newSt);
            }}/>;
          }
          
          return <SettingItem group={item.group} label={item.label} element={el} />
        })}
      </div>
    )
  }

  return (
    <MySetting className="setting-page">
      {setting ? renderSettingItem(setting): <Loader style="square" />}
    </MySetting>
  );
}

const MySetting = styled.div`
  color: #c1c2c3;
  .setting-container {
    .setting-item {
      display: flex;
      align-items: center;
      margin: 16px 0;
      .label {
        width: 150px;
        text-align: right;
      }
      .value {
        margin-left: 24px;
        font-size: 0.8rem;
        color: ${THEME.color.frontColorDeep}
      }
    }
  }
`;
