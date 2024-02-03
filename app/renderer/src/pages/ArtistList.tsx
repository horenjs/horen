import React, { useContext, useEffect, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { IoMdRefresh } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { MdOutlineDownloadDone as MdAdded } from 'react-icons/md';
import styled from 'styled-components';

import { readDB, refreshCover, Track } from '../api';
import { HorenContext } from '../App';
import Modal from '../components/Modal';
import defaultCover from '../defaultCover';
import Page, { PageProps } from './_page';

const ARTIST = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  padding-bottom: 88px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
`;

export type ArtistListPageProps = {} & PageProps;

export type Artist = {
  index: string;
  name: string;
  tracks: string[];
  trackList: Track[];
  cover: string;
};

export function ArtistListPage({ visible }: ArtistListPageProps) {
  const [artistList, setArtistList] = useState<Artist[]>([]);
  const [pickArtist, setPickArtist] = useState<Artist | null>(null);
  const { current, playOrPause, addToPlaylist, isInPlaylist, isPlaying } =
    useContext(HorenContext);

  const handleOpen = (album: Artist) => {
    setPickArtist(album);
  };

  useEffect(() => {
    (async () => {
      const artists: Artist[] = await readDB('artists');
      setArtistList(artists);
    })();
  }, []);

  return (
    <Page visible={visible}>
      <ARTIST>
        {artistList?.map((artist) => {
          return (
            <AlbumItem
              artist={artist}
              key={artist.index + artist.name}
              onOpen={handleOpen}
            />
          );
        })}
      </ARTIST>
      {pickArtist && (
        <Modal>
          <AlbumPanel
            artist={pickArtist}
            isPlaying={isPlaying}
            currentTrack={current}
            onClose={() => setPickArtist(null)}
            onPlayOrPause={(track) => playOrPause(track?.uid)}
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

const ARTIST_PANEL = styled.div`
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
  artist: artist,
  onPlayOrPause,
  onAdd,
  onClose,
  onAddAll,
  isPlaying,
  isAdd,
  currentTrack,
}: {
  artist: Artist;
  onPlayOrPause: (track: Track) => void;
  onAdd?: (track: Track) => void;
  onAddAll?: (tracks: Track[]) => void;
  onClose?: () => void;
  isPlaying?: boolean;
  isAdd: (track: Track) => boolean;
  currentTrack: Track | null;
}) {
  const isAllAdded = () => {
    for (const track of artist.trackList) {
      if (!isAdd(track)) return false;
    }
    return true;
  };

  const handleClose = () => {
    if (onClose) onClose();
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
    <ARTIST_PANEL className="album-panel">
      <div className="header">
        <div className="spring"></div>
        <span className="close-icon" onClick={handleClose}>
          <IoCloseSharp />
        </span>
      </div>
      <div className="main">
        <div className="left">
          <ArtistCover src={'horen:///' + artist.cover} />
          <div className="artist">{artist.name}</div>
          <div className="add-all">
            <span>
              {isAllAdded() ? <MdAdded size={20} /> : <MdAdd size={20} />}
            </span>
            <span
              className="add-text"
              onClick={() => handleAddAll(artist.trackList)}
            >
              {isAllAdded() ? '已全部添加至播放列表' : '添加所有至播放列表'}
            </span>
          </div>
        </div>
        <div className="right perfect-scrollbar-thin">
          {artist.trackList?.map((track) => {
            const isItemPlaying = isPlaying && currentTrack?.uid === track?.uid;
            const cls = 'track-item' + (isItemPlaying ? ' playing' : '');
            return (
              <div className={cls} key={track?.uid}>
                <div className="track-title single-line">{track?.title}</div>
                {isItemPlaying ? (
                  <div
                    className="track-icon"
                    onClick={() => onPlayOrPause(track)}
                  >
                    <FaPause size={18} />
                  </div>
                ) : (
                  <div
                    className="track-icon"
                    onClick={() => onPlayOrPause(track)}
                  >
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
    </ARTIST_PANEL>
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
  artist: Artist;
  onOpen?: (album: Artist) => void;
};

function AlbumItem({ artist, onOpen }: AlbumItemProps) {
  const [key, setKey] = useState(0);
  const handleOpen = () => {
    if (onOpen) onOpen({ ...artist });
  };

  const handleFresh = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('从网络获取专辑封面?')) {
      await refreshCover({
        artistName: artist.name,
        type: 100,
      });
      setKey(new Date().valueOf());
    }
  };

  return (
    <Item key={artist.name}>
      <div className="cover" onClick={handleOpen}>
        <ArtistCover src={'horen:///' + artist.cover} key={key} />
        <span className="refresh" onClick={handleFresh}>
          <IoMdRefresh />
        </span>
      </div>
      <div className="albumName single-line">{artist.name}</div>
    </Item>
  );
}

const ArtistCover = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
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
