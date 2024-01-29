import React, { useContext, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDownloadDone } from 'react-icons/md';
import styled from 'styled-components';

import { readDB, Track } from '../api';
import { HorenContext } from '../App';
import Page, { PageProps } from './_page';
import { normalizeDuration } from '../utils';

const TRACKLIST = styled.div`
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: auto;
  // display: grid;
  // padding-bottom: 88px;
  // grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  table {
    color: #c6c6c6;
    width: 100%;
    border-collapse: collapse;
  }
  th {
    text-align: left;
    font-size: 0.8rem;
  }
  tr {
    &:nth-child(2n) {
      background-color: #3c3c3c;
    }
    &:hover {
      background-color: #595959e1;
    }
  }
`;

const PureItem = styled.tr`
  color: #f1f1f1;
  margin: 4px 0;
  align-items: center;
  font-size: 0.9rem;
  .index {
    text-align: center;
    margin-right: 16px;
  }
  .first {
    width: 100%;
    display: flex;
    margin: 4px 0;
    align-items: center;
    justify-content: space-between;
    padding-right: 32px;
    .title {
      flex-grow: 1;
      min-width: 240px;
      width: 100%;
    }
    .operate {
      display: flex;
      align-items: center;
      .play {
        margin-left: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
      }
      .add {
        display: flex;
        align-items: center;
      }
    }
  }
  .artist {
    font-weight: 300;
  }
  .album {
    font-weight: 300;
  }
  .date {
    min-width: 80px;
    text-align: center;
  }
`;

export type PlayListPageProps = {} & PageProps;

export type TrackItemProps = {
  index?: number;
  track: Track;
  playing?: boolean;
  onPlay: (track: Track) => void;
  onAdd: (track: Track) => void;
  isAdd: (track: Track) => boolean;
};

export default function TrackList(props: PlayListPageProps) {
  const { visible } = props;
  const { player, trackList } = useContext(HorenContext);

  const handlePlay = (track: Track) => {
    player.play(track);
  };

  const handleAdd = (track: Track) => {
    player.add(track);
  };

  useEffect(() => {
    readDB<Track[]>('tracks').then((tracks) => {
      trackList.set(tracks);
    });
  }, [visible]);

  return (
    <Page visible={visible}>
      <TRACKLIST
        className="track-list perfect-scrollbar"
        style={{ display: visible ? 'block' : 'none' }}
      >
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>序号</th>
              <th>歌曲名</th>
              <th>歌手</th>
              <th>专辑</th>
              <th>时长</th>
              <th style={{ textAlign: 'center' }}>发行日期</th>
              <th>流派</th>
            </tr>
          </thead>
          <tbody>
            {trackList.value?.map((track: Track, index: number) => (
              <TrackPureItem
                index={index + 1}
                track={track}
                onPlay={handlePlay}
                onAdd={handleAdd}
                key={track.src}
                isAdd={player.isAdd}
                playing={player.currentTrack?.uid === track.uid}
              />
            ))}
          </tbody>
        </table>
      </TRACKLIST>
    </Page>
  );
}

function TrackPureItem({
  track,
  index,
  playing,
  onPlay,
  onAdd,
  isAdd,
}: TrackItemProps) {
  const handlePlay = () => {
    if (onPlay && track) onPlay(track);
  };

  const handlePause = () => {};

  const handleAdd = () => {
    if (onAdd && track) onAdd(track);
  };

  return (
    <PureItem key={track?.src}>
      <td>
        <div className="index">
          <span>{index}</span>
        </div>
      </td>
      <td>
        <div className="first">
          <div className="title">{track?.title}</div>
          <div className="operate">
            {playing ? (
              <div onClick={handlePause} className="play">
                <FaPause size={20} />
              </div>
            ) : (
              <div onClick={handlePlay} className="play">
                <FaPlay />
              </div>
            )}
            {track && !isAdd(track) ? (
              <div onClick={handleAdd} className="add">
                <IoMdAdd size={24} />
              </div>
            ) : (
              <MdOutlineDownloadDone size={24} />
            )}
          </div>
        </div>
      </td>
      <td>
        <div className="artist">{track?.artist}</div>
      </td>
      <td>
        <div className="album">{track?.album}</div>
      </td>
      <td>
        <div className="duration">
          {track?.duration !== undefined && normalizeDuration(track?.duration)}
        </div>
      </td>
      <td>
        <div className="date">
          {track?.date !== 'undefined' ? track?.date?.slice(0, 4) : '未知'}
        </div>
      </td>
      <td>
        <div className="genre">{track?.genre}</div>
      </td>
    </PureItem>
  );
}
