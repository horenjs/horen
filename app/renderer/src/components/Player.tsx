import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import PlayerBar from './PlayBar';
import { HorenContext } from '../App';
import { AlbumCover } from './Cover';
import { getLyric } from '../api';
import { lyricParser, LyricParser, normalizeDuration } from '../utils';
import { FaCirclePlay } from 'react-icons/fa6';

const PLAYER = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  transition: top 0.25s ease-in-out;
  z-index: 999;
  .playing {
    position: relative;
  }
`;

const ImageBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BlurBackground = styled.div`
  position: absolute;
  inset: 0;
  background-color: #333333c9;
  backdrop-filter: blur(10px);
  z-index: -1;
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
  width: 48%;
  height: calc(100vh - 64px);
  padding: 16px 32px 32px 16px;
  padding-top: 0;
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
  width: 52%;
  height: calc(100vh - 64px);
  padding: 16px 32px 64px 0px;
  padding-top: 0;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const TrackInfo = styled.div`
  width: 100%;
  padding: 0 16px;
  margin-bottom: 16px;
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
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding-right: 16px;
`;

const LyricScroll = styled.div`
  position: absolute;
  transition: all 0.55s ease-in-out;
  width: 100%;
  height: 100%;
  transform: translateY(-200px);
`;

function Player() {
  const [expanded, setExpanded] = useState(false);
  const [lyric, setLyric] = useState<LyricParser>();
  const [toTop, setToTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const top = !expanded ? 'calc(100vh - 64px)' : '0';
  const { current, seek, setSeek, isPlaying, playOrPause } =
    useContext(HorenContext);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const handleAutoScroll = useCallback((lyricToTop: number) => {
    setToTop(lyricToTop);
  }, []);

  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsScrolling(true);
      setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    },
    [isScrolling]
  );

  const handleSeek = (s: number) => {
    if (!isPlaying && current) playOrPause(current.uid);
    setSeek(s / (current?.duration || 1));
  };

  useEffect(() => {
    getLyric(current?.title || '').then((lrc) => {
      if (lrc) {
        setLyric(lyricParser(lrc));
      }
    });
  }, [current]);

  useEffect(() => {
    if (!isScrolling) {
      ref.current?.scrollTo({ top: toTop, behavior: 'smooth' });
    }
  }, [toTop]);

  return (
    <PLAYER className="player" style={{ top }}>
      <PlayBar style={{ background: expanded ? 'transparent' : '#232223' }}>
        <PlayerBar onExpand={handleClick} visible={!expanded} />
      </PlayBar>
      <ImageBackground>
        <img src={'horen:///' + current?.cover} alt="image-background" />
      </ImageBackground>
      <BlurBackground />
      <div
        style={{ display: 'flex', padding: '0 32px', top: expanded ? -8 : 0 }}
        className="playing"
      >
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
          <LyricArea className="no-scrollbar" onScroll={handleScroll} ref={ref}>
            <LyricScroll>
              <LyricPanel
                lyric={lyric}
                seek={seek}
                onScroll={handleAutoScroll}
                onSeek={handleSeek}
              />
            </LyricScroll>
          </LyricArea>
        </Lyric>
      </div>
    </PLAYER>
  );
}

const LyricPanelStyled = styled.div`
  color: #a4a4a4;
  height: 100%;
`;

const LyricTextLine = styled.div`
  position: relative;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 1.6rem;
  max-width: 100%;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  color: #727272;
  min-height: 3.2rem;
  .start {
    visibility: hidden;
  }
  &:hover {
    background-color: #3c3c3c5f;
    .start {
      visibility: visible;
    }
  }
  &.now-playing {
    color: #079f47b4;
    opacity: 1;
  }
`;

const LyricTextText = styled.div`
  display: inline-block;
`;

const LyricTextTime = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  span {
    display: flex;
    align-items: center;
    color: #10b45475;
    &:nth-child(2) {
      margin-left: 8px;
      position: relative;
      top: -1px;
    }
  }
`;

const LyricStartSpace = styled.div`
  height: 156px;
`;

const LyricTailSpace = styled.div`
  height: calc(100% - 200px);
`;

function LyricPanel({
  lyric,
  seek = 0,
  onScroll,
  onSeek,
}: {
  lyric?: LyricParser;
  seek?: number;
  onScroll?: (top: number) => void;
  onSeek?: (duration: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleSeek = (time: number) => {
    if (onSeek) onSeek(time);
  };

  useEffect(() => {
    if (ref.current) {
      for (const child of ref.current.children) {
        const target = child as HTMLDivElement;
        const playing = target.dataset['playing'] === 'true';
        if (playing) {
          if (onScroll) onScroll(target.offsetTop - 320);
        }
      }
    }
  }, [ref.current, seek]);

  return (
    <LyricPanelStyled ref={ref}>
      <LyricStartSpace></LyricStartSpace>
      {lyric?.scripts.map((scp) => {
        const playing = scp.start < seek && scp.end > seek;
        const cls = playing ? 'now-playing' : '';
        return (
          <LyricTextLine
            key={scp.start + '=>' + scp.end + scp.text}
            className={cls}
            data-start={scp.start}
            data-end={scp.end}
            data-playing={playing}
            onClick={() => handleSeek(scp.start)}
          >
            <LyricTextText>{scp.text}</LyricTextText>
            <LyricTextTime className="start">
              <span>
                <FaCirclePlay size={16} />
              </span>
              <span>{normalizeDuration(scp.start)}</span>
            </LyricTextTime>
          </LyricTextLine>
        );
      })}
      <LyricTailSpace></LyricTailSpace>
    </LyricPanelStyled>
  );
}

export default React.memo(Player);
