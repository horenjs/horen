/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 15:16:09
 * @LastEditTime : 2022-01-23 22:05:06
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\pages\setting\index.tsx
 * @Description  : setting page
 */
import React from 'react';
import styled from 'styled-components';
import { SettingDC } from '@/data-center';
import { Loader } from '@/components/loader';
import { Setting } from 'types';

export default function SettingPage() {
  const [setting, setSetting] = React.useState<Setting>();

  React.useEffect(() => {
    (async () => {
      const st = await SettingDC.get();
      setSetting(st);
    })();
  }, []);

  const renderItem = (value: any) => {
    if (value instanceof Array) {
      return (
        <div>
          {value.map((v) => (
            <div>{v}</div>
          ))}
        </div>
      );
    } else {
      return <div>{String(value)}</div>;
    }
  };

  return (
    <MySetting className="setting-page">
      {!setting ? (
        <Loader style="square" />
      ) : (
        setting.items.map((s) => {
          return s.children.map((c) => {
            return (
              <div className={`setting-item cate-${s.category}`} key={c.label}>
                <span className="label">{c.label}</span>
                <span className="item">{renderItem(c.value)}</span>
              </div>
            );
          });
        })
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
    span {
      display: inline-block;
      &.label {
        width: 180px;
        text-align: right;
        margin-right: 32px;
      }
      &.item {
        font-size: 0.9rem;
        color: #a1a2a3;
      }
    }
  }
`;
