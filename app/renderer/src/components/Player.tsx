import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import PlayerBar from './PlayBar';
import { HorenContext } from '../App';
import { AlbumCover } from './Cover';
import { getLyric } from '../api';
import { lyricParser, LyricParser } from '../utils';

const PLAYER = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #232526; /* fallback for old browsers */
  background: linear-gradient(
    to top,
    #292b2c,
    #232526
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  transition: top 0.25s ease-in-out;
  z-index: 999;
`;

const PlayBar = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const Cover = styled.div`
  display: flex;
  width: 50%;
  height: calc(100vh - 64px);
  padding: 16px 16px 32px 32px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .frame {
    width: 80%;
  }
`;

const Picture = styled.div`
  width: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Lyric = styled.div`
  display: flex;
  width: 50%;
  height: calc(100vh - 64px);
  padding: 16px 32px 64px 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const TrackInfo = styled.div`
  width: 100%;
  padding: 0;
  .title {
    font-size: 1.2rem;
    color: #e0e0e0;
  }
  .artist {
    font-size: 0.8rem;
    color: #aeaeae;
    margin-top: 4px;
  }
`;

const LyricArea = styled.div`
  height: calc(100% - 64px);
  width: 100%;
  overflow: auto;
`;

function Player() {
  const [expanded, setExpanded] = useState(false);
  const [lyric, setLyric] = useState<LyricParser>();
  const top = !expanded ? 'calc(100vh - 64px)' : '0';
  const { current, seek } = useContext(HorenContext);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    getLyric(current?.title || '').then((lrc) => {
      if (lrc) {
        setLyric(lyricParser(lrc));
      }
    });
  }, [current]);

  return (
    <PLAYER className="player" style={{ top }}>
      <PlayBar>
        <PlayerBar onExpand={handleClick} visible={!expanded} />
      </PlayBar>
      <div style={{ display: 'flex', padding: '0 32px' }}>
        <Cover className="player-cover">
          <div className="frame">
            <Picture>
              <AlbumCover
                src={'horen:///' + current?.cover}
                alt={current?.title}
              />
            </Picture>
          </div>
        </Cover>
        <Lyric className="player-lyric">
          <TrackInfo>
            <div className="title">{current?.title}</div>
            <div className="artist">{current?.artist}</div>
          </TrackInfo>
          <LyricArea className="perfect-scrollbar">
            <LyricPanel lyric={lyric} seek={seek} />
          </LyricArea>
        </Lyric>
      </div>
    </PLAYER>
  );
}

const LyricPanelStyled = styled.div`
  color: #a4a4a4;
`;

const LyricTextLine = styled.div`
  padding: 4px 0;
  transition: all 0.25s ease-in-out;
  &.now-playing {
    font-size: 1.2rem;
    color: #10b45475;
  }
`;

function LyricPanel({
  lyric,
  seek = 0,
}: {
  lyric?: LyricParser;
  seek?: number;
}) {
  return (
    <LyricPanelStyled>
      {lyric?.scripts.map((scp) => {
        const cls = scp.start < seek && scp.end > seek ? 'now-playing' : '';
        return (
          <LyricTextLine key={scp.start + '=>' + scp.end} className={cls}>
            {scp.text}
          </LyricTextLine>
        );
      })}
    </LyricPanelStyled>
  );
}

export default React.memo(Player);
