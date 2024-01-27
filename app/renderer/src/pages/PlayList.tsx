import React, { useContext, useEffect, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { GrLinkTop } from 'react-icons/gr';
import { IoCloseSharp } from 'react-icons/io5';
import styled from 'styled-components';

import { Track, readCoverSource } from '../api';
import { HorenContext } from '../App';
import { normalizeDuration } from '../utils';
import Page, { PageProps } from './_page';

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
    max-height: 80px;
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
  .cover-thumbnail {
    height: 44px;
    width: 44px;
    margin-right: 12px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .to-top {
    visibility: hidden;
    margin-right: 24px;
    display: flex;
    align-items: center;
  }
  .play-or-pause {
    visibility: hidden;
    margin-right: 16px;
    user-select: none;
    span {
      display: flex;
      align-items: center;
    }
  }
  .delete {
    visibility: hidden;
    user-select: none;
    margin-right: 32px;
    display: flex;
    align-items: center;
    color: #c50d0d;
  }
  .play-list-item {
    &:hover {
      .to-top {
        visibility: visible;
      }
      .play-or-pause {
        visibility: visible;
      }
      .delete {
        visibility: visible;
      }
    }
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

  const handleDel = (track: Track) => {
    player.remove(track);
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
                onDel={handleDel}
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
  onDel,
  isPlaying,
}: {
  track: Track;
  onPlay: (track: Track) => void;
  onPause: () => void;
  onDel: (track: Track) => void;
  isPlaying: boolean;
}) {
  const [cover, setCover] = useState('');

  const handlePlay = () => {
    if (onPlay) onPlay(track);
  };

  const handlePause = () => {
    if (onPause) onPause();
  };

  const handleDel = (track: Track) => {
    if (onDel) onDel(track);
  };

  useEffect(() => {
    readCoverSource(track.album || '', track.artist).then(setCover);
  }, []);

  return (
    <tr className="play-list-item">
      <td>
        <div className="trackTitle">
          <div className="cover-thumbnail">
            <img src={cover} alt={track.title} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <div className="trackTitle-title">{track.title}</div>
            <div className="trackTitle-artist">{track.artist}</div>
          </div>
          <div className="to-top">
            <GrLinkTop />
          </div>
          <div className="play-or-pause">
            {isPlaying ? (
              <span onClick={handlePause}>
                <FaPause size={16} />
              </span>
            ) : (
              <span onClick={handlePlay}>
                <FaPlay size={16} />
              </span>
            )}
          </div>
          <div className="delete" onClick={() => handleDel(track)}>
            <IoCloseSharp size={22} />
          </div>
        </div>
      </td>
      <td>
        <div>{track.album}</div>
      </td>
      <td>
        <div>{track.duration && normalizeDuration(track.duration)}</div>
      </td>
    </tr>
  );
}
