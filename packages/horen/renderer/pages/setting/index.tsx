/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 15:16:09
 * @LastEditTime : 2022-01-27 22:38:22
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\pages\setting\index.tsx
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
        <div className="setting-container">
          {setting.groups.map((group, index) => {
            return (
              <div
                className={`setting-groups setting-group-${group.name}`}
                key={group.name}
              >
                {/* 将标题模拟为一个设置项 以使得对齐更加标准 */}
                <div className="setting-group">
                  <div className="setting-item">
                    <span className="label">
                      <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {group.title}
                      </div>
                    </span>
                  </div>
                </div>
                <SettingGroup
                  group={group}
                  onChange={async (newGroup) => {
                    const groups = [...setting.groups];
                    groups[index] = newGroup;
                    setSetting({ ...setting, groups });
                    await SettingDC.set({ ...setting, groups });
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <Loader style="square" />
      )}
    </MySetting>
  );
}

const MySetting = styled.div`
  color: #c1c2c3;
  .setting-container {
    width: 70%;
    .setting-groups {
      padding: 8px 0;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 90%;
        transform: translateX(-50%);
        border-top: 1px solid #444;
      }
      .setting-item {
        display: flex;
        align-items: center;
        margin: 16px 0;
        flex-wrap: wrap;
        span {
          display: inline-block;
          &.label {
            width: 180px;
            font-size: 0.9rem;
            text-align: right;
            margin-right: 32px;
          }
          &.value {
            font-size: 0.8rem;
            color: #a1a2a3;
          }
        }
      }
    }
  }
`;
