import React, { useContext, useEffect, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { IoMdRefresh } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { MdOutlineDownloadDone as MdAdded } from 'react-icons/md';
import styled from 'styled-components';

import { readDB, refreshAlbumCover, Track } from '../api';
import { HorenContext } from '../App';
import Modal from '../components/Modal';
import defaultCover from '../defaultCover';
import Page, { PageProps } from './_page';

const ALBUM = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  padding-bottom: 88px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
`;

export type AlbumListPageProps = {} & PageProps;

export type Album = {
  index: string;
  title: string;
  artist: string;
  tracks: string[];
  trackList: Track[];
  cover?: string;
};

export function AlbumListPage({ visible }: AlbumListPageProps) {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [pickAlbum, setPickAlbum] = useState<Album | null>(null);
  const { current, playOrPause, addToPlaylist, isInPlaylist, isPlaying } =
    useContext(HorenContext);

  const handleOpen = (album: Album) => {
    setPickAlbum(album);
  };

  useEffect(() => {
    (async () => {
      const albums: Album[] = await readDB('albums');
      setAlbumList(albums);
    })();
  }, []);

  return (
    <Page visible={visible}>
      <ALBUM>
        {albumList?.map((album) => {
          return (
            <AlbumItem
              album={album}
              key={album.index + album.title}
              onOpen={handleOpen}
            />
          );
        })}
      </ALBUM>
      {pickAlbum && (
        <Modal>
          <AlbumPanel
            album={pickAlbum}
            isPlaying={isPlaying}
            currentTrack={current}
            onClose={() => setPickAlbum(null)}
            onPlay={(track) => playOrPause(track.uid)}
            onPause={(track) => playOrPause(track.uid)}
            onAdd={(track) => addToPlaylist([track.uid])}
            onAddAll={(tracks) =>
              addToPlaylist(tracks.map((track) => track.uid))
            }
            isAdd={(track) => isInPlaylist(track?.uid)}
          />
        </Modal>
      )}
    </Page>
  );
}

const ALBUM_PANEL = styled.div`
  max-height: 400px;
  width: 520px;
  background-color: #333;
  padding: 0 16px 16px 16px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .header {
    padding: 4px 0;
    color: #939393;
    display: flex;
    align-items: center;
    .spring {
      flex-grow: 1;
    }
    .close-icon {
      display: flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        background-color: #474747;
      }
    }
  }
  .main {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .left {
    width: 40%;
    padding-left: 16px;
    .title {
      color: #d6d6d6;
      padding: 4px;
      text-align: center;
      margin-top: 16px;
    }
    .artist {
      color: #a4a4a4;
      padding: 4px;
      text-align: center;
      font-size: 0.8rem;
    }
    .add-all {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1d1d1d;
      color: #a7a7a7;
      padding: 4px 12px 4px 8px;
      width: fit-content;
      margin: 8px auto;
      cursor: pointer;
      span {
        display: flex;
        align-items: center;
      }
      .add-text {
        position: relative;
        top: -1px;
        user-select: none;
        font-size: 0.8rem;
      }
    }
  }
  .right {
    width: 60%;
    height: 344px;
    padding: 0 16px 0 16px;
    color: #c7c7c7;
    font-size: 0.9rem;
    overflow-y: auto;
    .track-item {
      padding: 4px 0;
      padding-left: 8px;
      padding-right: 4px;
      display: flex;
      align-items: center;
      &.playing {
        background-color: #10b45475;
      }
    }
    .track-title {
      flex-grow: 1;
    }
    .track-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
    }
  }
`;

function AlbumPanel({
  album,
  onPlay,
  onPause,
  onAdd,
  onClose,
  onAddAll,
  isPlaying,
  isAdd,
  currentTrack,
}: {
  album: Album;
  onPlay?: (track: Track) => void;
  onPause?: (track: Track) => void;
  onAdd?: (track: Track) => void;
  onAddAll?: (tracks: Track[]) => void;
  onClose?: () => void;
  isPlaying?: boolean;
  isAdd: (track: Track) => boolean;
  currentTrack: Track | null;
}) {
  const isAllAdded = () => {
    for (const track of album.trackList) {
      if (!isAdd(track)) return false;
    }
    return true;
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handlePlay = (track: Track) => {
    if (onPlay) onPlay(track);
  };

  const handlePause = (track: Track) => {
    if (onPause) onPause(track);
  };

  const handleAdd = (track: Track) => {
    if (onAdd) onAdd(track);
  };

  const handleAddAll = (tracks: Track[]) => {
    if (!isAllAdded()) {
      if (onAddAll) onAddAll(tracks);
    }
  };

  return (
    <ALBUM_PANEL className="album-panel">
      <div className="header">
        <div className="spring"></div>
        <span className="close-icon" onClick={handleClose}>
          <IoCloseSharp />
        </span>
      </div>
      <div className="main">
        <div className="left">
          <img
            src={'horen:///' + album.cover}
            alt={album.title + album.artist}
          />
          <div className="title">{album.title}</div>
          <div className="artist">{album.artist}</div>
          <div className="add-all">
            <span>
              {isAllAdded() ? <MdAdded size={20} /> : <MdAdd size={20} />}
            </span>
            <span
              className="add-text"
              onClick={() => handleAddAll(album.trackList)}
            >
              {isAllAdded() ? '已全部添加至播放列表' : '添加所有至播放列表'}
            </span>
          </div>
        </div>
        <div className="right perfect-scrollbar-thin">
          {album.trackList?.map((track) => {
            const isItemPlaying = isPlaying && currentTrack?.uid === track.uid;
            const cls = 'track-item' + (isItemPlaying ? ' playing' : '');
            return (
              <div className={cls} key={track?.uid}>
                <div className="track-title single-line">{track?.title}</div>
                {isItemPlaying ? (
                  <div
                    className="track-icon"
                    onClick={() => handlePause(track)}
                  >
                    <FaPause size={18} />
                  </div>
                ) : (
                  <div className="track-icon" onClick={() => handlePlay(track)}>
                    <FaPlay />
                  </div>
                )}
                <div className="track-icon" onClick={() => handleAdd(track)}>
                  {isAdd(track) ? <MdAdded size={20} /> : <MdAdd size={20} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ALBUM_PANEL>
  );
}

const Item = styled.li`
  height: 188px;
  margin: 8px;
  list-style: none;
  cursor: pointer;
  img {
    width: 100%;
    height: 132px;
    margin-bottom: 4px;
    object-fit: cover;
  }
  .albumName {
    padding: 0 4px;
    font-size: 0.9rem;
    color: #f1f1f1;
    width: 100%;
    height: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .artistName {
    padding: 0 4px;
    margin-top: 4px;
    height: 18px;
    overflow: hidden;
    font-size: 0.8rem;
    font-weight: 300;
    color: #969696;
  }
  .cover {
    position: relative;
    &:hover {
      .refresh {
        visibility: visible;
      }
    }
  }
  .refresh {
    position: absolute;
    left: 4px;
    bottom: 8px;
    color: #8b8b8b;
    visibility: hidden;
    cursor: pointer;
  }
`;

export type AlbumItemProps = {
  album: Album;
  onOpen?: (album: Album) => void;
};

function AlbumItem({ album, onOpen }: AlbumItemProps) {
  const [key, setKey] = useState(0);
  const handleOpen = () => {
    if (onOpen) onOpen({ ...album });
  };

  const handleFresh = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('从网络获取专辑封面?')) {
      await refreshAlbumCover(album.title, album.artist.split(',')[0]);
      setKey(new Date().valueOf());
    }
  };

  return (
    <Item key={album.title + album.artist}>
      <div className="cover" onClick={handleOpen}>
        <AlbumCover
          src={'horen:///' + album.cover}
          alt={album.title + album.artist}
          key={key}
        />
        <span onClick={handleFresh} className="refresh">
          <IoMdRefresh />
        </span>
      </div>
      <div className="albumName single-line">{album.title}</div>
      <div className="artistName">{album.artist}</div>
    </Item>
  );
}

const AlbumCover = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [isError, setIsError] = useState(true);
  const handleError = (e: any) => {
    if (isError) {
      setIsError(false);
      (e.target as HTMLImageElement).src =
        'data:image/png;base64,' + defaultCover;
    }
  };
  return <img onError={handleError} {...props} />;
};
