/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 02:19:07
 * @LastEditTime : 2022-02-01 17:53:09
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\pages\library\index.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import {useRecoilState, useRecoilValue} from 'recoil';
import { albumListState, tracksInQueueState } from '@/store';
import { player } from '@/App';
import { Loader } from '@/components/loader';
import Mask from '@/components/mask';
import {Track, Album} from 'types';
import { AlbumModal } from './album-modal';
import { AlbumView } from './album-viewer';
import {TrackDC} from "@/data-center";
import defaultCover from "@/static/image/default-cover";

export function Library() {
  const [current, setCurrent] = React.useState(0);
  const [pickAlbum, setPickAlbum] = React.useState<Album>();
  const [coverList, setCoverList] = React.useState<string[]>([]);

  const [tracksInQueue, setTracksInQueue] = useRecoilState(tracksInQueueState);
  const albumList = useRecoilValue(albumListState);
  
  /**
   * 点击专辑（打开专辑预览）
   * @param a
   */
  const handleOpenAlbum = async (a: Album) => {
    const res = await TrackDC.getAlbumByKey(a.key);
    albumList.map((album, index) => {
      if (album.key === a.key) setCurrent(index);
    })
    setPickAlbum(res);
  };
  
  /**
   * 关闭专辑预览
   */
  const handleCloseAlbumModal = () => setPickAlbum(undefined);
  
  /**
   * 挑选 track
   * @param tracks 添加的 track 列表
   * @param mode 添加或切歌
   */
  const handlePickTrack = (tracks: Track[], mode: 'cut' | 'add') => {
    const filtered = tracks.filter((t) => {
      return !isInTracks(tracksInQueue, t);
    });
    
    switch (mode) {
      case 'cut':
        // 切歌则将歌曲放到播放队列首位
        setTracksInQueue([...filtered, ...tracksInQueue]);
        player.currentTrack = tracks[0];
        break;
      case 'add':
        // 添加则将歌曲放到播放队列尾部
        setTracksInQueue([...tracksInQueue, ...filtered]);
        break;
      default:
        // 默认为添加
        setTracksInQueue([...tracksInQueue, ...filtered]);
    }
  };

  React.useEffect(() => {
    (async () => {
      const covers = [];
      for (const a of albumList) {
        const res = await TrackDC.getAlbumCover(a.key);
        const c = a.children
          ? a.children[0].picture ? a.children[0].picture : defaultCover
          : res ? res : defaultCover
        covers.push(c);
      }
      setCoverList(covers);
    })();
  }, [albumList])

  return (
    <MyLib className="component-library">
      <div className="albums">
        {albumList.length === 0 ? (
          <div>
            <Loader style="square" />
          </div>
        ) : (
          albumList.map((a, index) => {
            return (
              <AlbumView
                album={a}
                onOpen={handleOpenAlbum}
                key={a.key || index}
              />
            )
          })
        )}
      </div>

      {pickAlbum?.children?.length && (
        <AlbumModal
          tracksInQueue={tracksInQueue.map((track) => {
            // 判断歌曲是否在播放中
            if (track?.title === player.currentTrack?.title)
              return { ...track, playStatus: 'playing' };
            else return track;
          })}
          currentTrack={player.currentTrack}
          album={pickAlbum}
          cover={coverList[current]}
          onPick={handlePickTrack}
          onClose={handleCloseAlbumModal}
        />
      )}

      {pickAlbum && (
        <Mask depth={999} opacity={0.9} onClick={() => setPickAlbum(undefined)} />
      )}
    </MyLib>
  );
}

const MyLib = styled.div`
  height: 100%;
  background-color: #313233;
  color: #f1f1f1;
  .albums {
    display: flex;
    flex-wrap: wrap;
    .album {
      display: inline-block;
      height: 280px;
      width: 192px;
      margin: 8px 16px;
      cursor: pointer;
      img {
        width: 100%;
        height: calc(100% - 88px);
        object-fit: cover;
        border-radius: 4px;
      }
      .info {
        .name {
          color: #f1f1f1;
        }
        .track-count,
        .artist {
          color: #aaa;
          font-size: 0.8rem;
          margin: 4px 0;
        }
      }
    }
  }
  .album-modal-view {
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    width: 680px;
    max-height: 520px;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -35%);
    padding: 0 32px 32px 32px;
    background-color: #313233;
    color: #aaa;
    box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    z-index: 9999;
    .album-header {
      width: 100%;
      padding: 16px 4px 12px 4px;
      display: flex;
      .add-all {
        flex-grow: 1;
        span {
          font-size: 0.8rem;
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          background-color: #272829;
        }
        span:hover {
          background-color: #212223;
        }
      }
      .close-button {
        display: inline-block;
        cursor: pointer;
        &:hover {
          color: #f1f1f1;
        }
      }
    }
    .album-children {
      width: calc(100% - 280px);
      max-height: calc(480px - 60px);
      margin: 16px 48px 0 0;
      padding-right: 8px;
      flex-wrap: wrap;
      overflow-y: hidden;
      &:hover {
        overflow-y: auto;
      }
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #4a4b4c;
      }
      .album-child {
        width: calc(100% - 4px);
        padding: 6px 8px 6px 8px;
        cursor: pointer;
        text-align: left;
        display: flex;
        align-items: center;
        border-radius: 4px;
        &:hover {
          background-color: #2a2b2c;
          .operator {
            visibility: visible;
            .add-to {
              &:hover {
                color: #f1f1f1;
              }
            }
          }
        }
        .title {
          display: flex;
          align-items: center;
          flex-grow: 1;
          &-order {
            width: 32px;
            text-align: right;
            padding: 0 16px 0 0;
          }
          &-text {
            width: calc(100% - 32px);
          }
        }
        .operator {
          font-size: 1.2rem;
          visibility: hidden;
        }
      }
    }
    .album-infos {
      width: 192px;
      line-height: 2;
      font-size: 0.9rem;
      .name {
        width: 100%;
        color: #f1f1f1;
        text-align: center;
        margin: 0 0 16px 0;
        font-size: 1.2rem;
        font-weight: 500;
      }
      .cover img {
        width: 192px;
        // height: 192px;
        object-fit: cover;
        border-radius: 4px;
      }
      .count,
      .artists,
      .date,
      .path {
        span {
          display: inline-block;
          margin-right: 8px;
          width: 60px;
          text-align: right;
          color: #bfbfbf;
        }
      }
      .count {
        margin: 4px 0;
        color: #ccc;
        text-align: center;
      }
      .path {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
`;

/**
 * 通过 src 判断 track 是否在 track 列表中
 * @param tracks
 * @param track
 */
export function isInTracks(tracks: Track[], track: Track) {
  let count = 0;

  for (const t of tracks) {
    if (t.src === track.src) count += 1;
  }

  return count > 0;
}

export function findTitleFromKey(key: string) {
  const result = key.match(/#[\S\s]+#/gi);
  if (result) return result[0].replace(/#/, '').replace(/#/, '');
}

export function findArtistFromKey(key: string) {
  const result = key.match(/@[\S\s]+@/gi);
  if (result) return result[0].replace(/@/, '').replace(/@/, '');
}

export default Library;
