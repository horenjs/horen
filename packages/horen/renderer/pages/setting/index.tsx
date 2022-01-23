/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-23 15:16:09
 * @LastEditTime : 2022-01-23 16:22:00
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\pages\setting\index.tsx
 * @Description  : setting page
 */
import React from 'react';
import styled from 'styled-components';

const settings = [
  {
    category: 'apperance',
    children: [
      {
        label: 'Collection Location',
        item: (
          <div>
            <div>D:\\hello\\hello</div>
            <div>D:\\hello\\hello</div>
            <div>D:\\hello\\hello</div>
            <div>D:\\hello\\hello</div>
          </div>
        ),
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
      {
        label: 'Language',
        item: <div>Chinese</div>,
      },
    ],
  },
  {
    category: 'common',
    children: [
      {
        label: 'Refresh When Open',
        item: <div>yes</div>,
      },
    ],
  },
];

export default function SettingPage() {
  return (
    <MySetting className="setting-page">
      {settings.map((s) => {
        return s.children.map((c) => {
          return (
            <div className={`setting-item cate-${s.category}`} key={s.category}>
              <span className="label">{c.label}</span>
              <span className="item">{c.item}</span>
            </div>
          );
        });
      })}
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
