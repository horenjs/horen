/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 15:16:09
 * @LastEditTime : 2022-01-25 17:32:43
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\pages\setting\index.tsx
 * @Description  : setting page
 */
import React from 'react';
import styled from 'styled-components';
import { SettingDC } from '@/data-center';
import { Loader } from '@/components/loader';
import { SettingFile } from 'types';
import SettingGroup from './setting-group';

export default function SettingPage() {
  const [setting, setSetting] = React.useState<SettingFile>();

  React.useEffect(() => {
    (async () => {
      const st = await SettingDC.get();
      setSetting(st);
    })();
  }, []);

  React.useEffect(() => {
    // console.log(setting);
    (async () => {
      if (setting) await SettingDC.set(setting);
    })();
  }, [setting?.updateAt]);

  return (
    <MySetting className="setting-page">
      {setting?.grounps ? (
        setting?.grounps.map((group) => {
          return (
            <div className={`setting-group-${group.name}`} key={group.name}>
              <h1 style={{padding: '0 0 0 40px'}}>{ group.name }</h1>
              <SettingGroup
                group={group}
                onSubmit={(g) => {
                  const index = setting.grounps.indexOf(group);
                  const newgroups = [...setting.grounps];
                  newgroups[index] = g;
                  const newSt = {
                    ...setting,
                    updateAt: new Date().valueOf(),
                    grounps: newgroups,
                  };
                  setSetting(newSt);
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
