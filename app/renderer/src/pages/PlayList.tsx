import React, { useContext } from 'react';
import styled from 'styled-components';
import { HorenContext } from '../App';
import { Track } from '../api';
import Page, { PageProps } from './_page';
import { CiPlay1, CiPause1 } from 'react-icons/ci';

const PLAYING = styled.div`
  .song {
    user-select: none;
  }
  table {
    width: 100%;
    color: #f1f1f1;
    border-collapse: collapse;
    .title {
      width: 200px;
      text-align: left;
      padding: 0 12px;
    }
    .album {
      width: 150px;
      text-align: left;
    }
    .time {
      text-align: left;
      width: 100px;
    }
  }
  th {
    font-size: 0.8rem;
    font-weight: 400;
    color: #7e7e7e;
  }
  tr:nth-child(2n) {
    background-color: #3b3b3b;
  }
  tr:hover {
    background-color: #494949;
  }
  td {
    margin: 0;
    padding: 0;
    color: #d4d4d4;
  }
  .trackTitle {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    .trackTitle-title {
      font-size: 0.9rem;
      color: #d4d4d4;
    }
    .trackTitle-artist {
      font-size: 0.8rem;
      color: #aaa;
      font-weight: 300;
    }
  }
  .play-or-pause {
    margin-right: 32px;
    user-select: none;
  }
`;

export type PlayListPageProps = {} & PageProps;

export default function PlayList(props: PlayListPageProps) {
  const { visible } = props;
  const { player } = useContext(HorenContext);

  const handlePlay = (track: Track) => {
    player.play(track);
  };

  const handlePause = () => {
    player.pause();
  };

  return (
    <Page visible={visible}>
      <PLAYING style={{ display: visible ? 'block' : 'none' }}>
        <table>
          <thead>
            <tr>
              <th className="title">标题</th>
              <th className="album">专辑名</th>
              <th className="time">时长</th>
            </tr>
          </thead>
          <tbody>
            {player.playList?.map((track: Track) => (
              <PlayListItem
                track={track}
                onPlay={handlePlay}
                onPause={handlePause}
                isPlaying={
                  player.isPlaying && player.currentTrack?.uid === track.uid
                }
                key={track.uid}
              />
            ))}
          </tbody>
        </table>
      </PLAYING>
    </Page>
  );
}

export function PlayListItem({
  track,
  onPlay,
  onPause,
  isPlaying,
}: {
  track: Track;
  onPlay: (track: Track) => void;
  onPause: () => void;
  isPlaying: boolean;
}) {
  const handlePlay = () => {
    if (onPlay) onPlay(track);
  };

  const handlePause = () => {
    if (onPause) onPause();
  };

  return (
    <tr>
      <td>
        <div className="trackTitle">
          <div style={{ flexGrow: 1 }}>
            <div className="trackTitle-title">{track.title}</div>
            <div className="trackTitle-artist">{track.artist}</div>
          </div>
          <div className="play-or-pause">
            {isPlaying ? (
              <span onClick={handlePause}>
                <CiPause1 />
              </span>
            ) : (
              <span onClick={handlePlay}>
                <CiPlay1 />
              </span>
            )}
          </div>
        </div>
      </td>
      <td>
        <div>{track.album}</div>
      </td>
      <td>
        <div>{track.duration?.toFixed(2)}</div>
      </td>
    </tr>
  );
}
