/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-30 15:16:38
 * @LastEditTime : 2022-02-01 17:41:46
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\lyric-panel\lyric.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import { LyricScript } from 'types';
import { THEME } from 'constant';

export interface LyricPanelProps {
  lyrics: LyricScript[];
  seek: number;
}

export function LyricPanel(props: LyricPanelProps) {
  const { lyrics, seek } = props;

  const [top, setTop] = React.useState(0);
  const [current, setCurrent] = React.useState(0);

  const isApproximateEqual = (s: number, time: number) => {
    return Math.abs(s - time) < 0.5;
  };

  React.useEffect(() => {
    lyrics?.forEach((lrc, index) => {
      if (isApproximateEqual(seek, lrc.start)) {
        setTop(44 * index);
        setCurrent(index);
      }
    });
  }, [seek]);

  return (
    <MyLyric className="component-lyric-panel">
      {lyrics ? (
        <div className="container" style={{ top: 200 - top }}>
          {lyrics.map((lyric, index) => {
            const color = index === current ? THEME.color.primary : '#f1f1f1';
            const fontSize = index === current ? '1.3rem' : '1rem';
            const height = index === current ? 26 : 20;
            const margin = index === current ? '32px 0' : '24px 0';

            return (
              <div
                className="lyric-item"
                key={lyric.start+new Date().valueOf()}
                data-time={lyric.start}
                data-index={index}
                style={{ height, margin }}
              >
                <span className="text" style={{ color, fontSize }}>
                  {lyric.text}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-lyric">无法获取歌词</div>
      )}
    </MyLyric>
  );
}

const MyLyric = styled.div`
  overflow: hidden;
  .container {
    position: relative;
    color: #f1f1f1;
    transition: all 0.5s ease-in-out;
    top: 200px;
    text-align: center;
    .lyric-item {
      transition: all 0.25s ease-in-out;
    }
  }
  .no-lyric {
    padding: 100% 0 0 0;
  }
`;
