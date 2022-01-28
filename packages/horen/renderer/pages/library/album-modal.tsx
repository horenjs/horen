/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 12:32:21
 * @LastEditTime : 2022-01-28 11:06:28
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\renderer\pages\library\album-modal.tsx
 * @Description  :
 */
import React from 'react';
import defaultCover from '@/static/image/default-cover';
import { Track, Album } from 'types';

interface Props {
  album: Album;
  onClose(): void;
  onAddTo(tracks: Track[]): void;
  tracksInQueue?: Track[];
}

export function AlbumModal(props: Props) {
  const { album, onClose, onAddTo, tracksInQueue } = props;

  const publishDate = album.children[0].date;
  const artist = album.children[0].artist;
  const filesPath = album.children[0].src;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleAddTo = (e: React.MouseEvent<HTMLSpanElement>, ts: Track[]) => {
    e.preventDefault();
    e.stopPropagation();
    onAddTo([...ts]);
  };

  const renderItem = (item: Track, index: number) => {
    let child = (
      <span
        className="add-to"
        onClick={(e) => handleAddTo(e, [item])}
        title="添加到播放列表"
      >
        ✚
      </span>
    );

    let status;

    if (tracksInQueue) {
      const i = tracksInQueue?.map((track) => track.title).indexOf(item.title);
      if (i >= 0) {
        status = tracksInQueue[i].playStatus;
        if (status === 'in-queue') {
          child = <span title="已经在播放列表中">✔</span>;
        } else if (status === 'playing') {
          child = <span title="正在播放中">♫</span>;
        }
      }
    }

    return (
      <div className="album-child" key={item.title} data-title={item.title}>
        <div
          className="title"
          style={{ color: status === 'playing' ? '#1ece9d' : '#aaa' }}
        >
          <div className="title-order">{index + 1 + '.'}</div>
          <div className="title-text">{item.title}</div>
        </div>
        <div className="operator">{child}</div>
      </div>
    );
  };

  return (
    <div className="album-modal-view">
      <div className="album-header">
        <div className="add-all">
          <span
            role="button"
            onClick={(e) => {
              handleAddTo(e, album.children);
            }}
          >
            ✚ 全部添加
          </span>
        </div>
        <div className="close-button" role="button" onClick={handleClose}>
          ✕
        </div>
      </div>

      <div className="album-children">{album.children.map(renderItem)}</div>

      <div className="album-infos">
        <div className="name">{album.name}</div>
        <div className="cover">
          <img
            src={`data:image/png;base64,${
              album.children[0].picture || defaultCover
            }`}
            alt={album.name}
          />
        </div>
        <div className="count">{album.children.length} 首歌曲</div>
        <div className="date">
          <span>发行时间</span> {publishDate}
        </div>
        <div className="artists">
          <span>艺术家</span> {artist}
        </div>
        <div className="path" title={filesPath}>
          <span>专辑路径</span> {filesPath}
        </div>
      </div>
    </div>
  );
}
