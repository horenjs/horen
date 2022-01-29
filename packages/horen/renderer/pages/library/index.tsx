/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 02:19:07
 * @LastEditTime : 2022-01-29 21:47:44
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\pages\library\index.tsx
 * @Description  :
 */
import React from 'react';
import styled from 'styled-components';
import { useRecoilValue, useRecoilState } from 'recoil';
import { albumListState, tracksInQueueState } from '@/store';
import { Track, Album } from 'types';
import { AlbumModal } from './album-modal';
import { AlbumView } from './album-viewer';
import { Loader } from '@/components/loader';
import { player } from '@/App';

export function Library() {
  const [album, setAlbum] = React.useState<Album>();

  const [tracksInQueue, setTracksInQueue] = useRecoilState(tracksInQueueState);
  const albums = useRecoilValue(albumListState);

  const handleOpenAlbum = (a: Album) => {
    setAlbum(a);
  };

  const handleAddTrack = (tracks: Track[]) => {
    const tracksToPlay = tracks.map((track) => {
      return { ...track, playStatus: 'in-queue' };
    }) as Track[];

    setTracksInQueue([...tracksInQueue, ...tracksToPlay]);
  };

  const handleCloseAlbumModal = () => setAlbum(undefined);

  return (
    <MyLib className="component-library">
      <div className="albums">
        {albums.length === 0 ? (
          <div>
            <Loader style="square" />
          </div>
        ) : (
          albums.map((value, index) => (
            <AlbumView
              album={value}
              onOpen={handleOpenAlbum}
              key={value.title || index}
            />
          ))
        )}
      </div>

      {album && (
        <AlbumModal
          tracksInQueue={tracksInQueue.map((track) => {
            // 判断歌曲是否在播放中
            if (track?.title === player.currentTrack?.title)
              return { ...track, playStatus: 'playing' };
            else return track;
          })}
          album={album}
          onAddTo={handleAddTrack}
          onClose={handleCloseAlbumModal}
        />
      )}

      {album && <div className="mask"></div>}
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
    width: 620px;
    max-height: 480px;
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
      max-height: calc(480px - 100px);
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
        height: 192px;
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

export default Library;
