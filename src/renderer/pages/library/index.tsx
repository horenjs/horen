/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 02:19:07
 * @LastEditTime : 2022-01-19 23:19:53
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \mintin-alo\src\renderer\pages\library\index.tsx
 * @Description  : 
 */
import { FileDC } from '../../data-center';
import React from 'react';
import styled from 'styled-components';
import { ISong } from '../../../types';
import defaultCover from '../../components/control-panel/default-cover';

const MyLib = styled.div`
  padding: 32px 48px;
  height: calc(100vh - 140px);
  overflow: auto;
  background-color: #313233;
  color: #f1f1f1;
  .albums {
    display: flex;
    flex-wrap: wrap;
    .album {
      display: inline-block;
      height: 272px;
      width: 192px;
      margin: 8px 16px 8px 0;
      cursor: pointer;
      img {
        width: 100%;
        height: calc(100% - 70px);
        object-fit: cover;
        border-radius: 4px;
      }
      .info {
        .name {
          color: #f1f1f1;
        }
        .artist {
          color: #aaa;
          font-size: 0.8rem;
          margin: 4px 0;
        }
      }
    }
  }
  .album-view {
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    width: 520px;
    max-height: 480px;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -35%);
    padding: 0 32px 32px 32px;
    background-color: #313233;
    color: #aaa;
    box-shadow:2px 2px 16px rgba(255,255,255,0.5);
    border-radius: 8px;
    z-index: 9999;
    .album-close {
      width: 100%;
      padding: 16px 0;
      text-align: right;
      .close-button {
        display: inline-block;
        cursor: pointer;
        &:hover {
          color: #f1f1f1;
        }
      }
    }
    .album-children {
      width: calc(100% - 296px);
      max-height: 408px;
      margin: 0 64px 0 0;
      padding-right: 8px;
      display: flex;
      align-items: center;
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
        width: 100%;
        padding: 6px 8px 6px 0;
        cursor: pointer;
        text-align: left;
        display: flex;
        &:hover {
          background-color: #2a2b2c;
          .operator {
            visibility: visible;
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
          font-size: 1.5rem;
          visibility: hidden;
        }
      }
    }
    .album-infos {
      width: 192px;
      line-height: 2;
      font-size: .9rem;
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
      .count,.artists,.date,.path {
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

export interface Album {
  name: string,
  children: ISong[],
  [key: string]: any,
} 

export interface LibraryProps {
  onAddToPlaylist?(songs: ISong[]): void;
}

const Library: React.FC<LibraryProps> = (props) => {
  const { onAddToPlaylist } = props;

  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [album, setAlbum] = React.useState<Album>();

  const handleOpenAlbum = (e: React.MouseEvent<HTMLElement>, a: Album) => {
    e.preventDefault();
    e.stopPropagation();
    setAlbum(a);
  }

  const handleISong = (e: React.MouseEvent<HTMLElement>, song: ISong) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToPlaylist) {
      onAddToPlaylist([song]);
    }
  }

  React.useEffect(() => {
    const p = 'D:\\Music\\流行音乐\\CRITTY\\单曲';
    (async () => {
      const files = await FileDC.getList(p);

      const abs: Album[] = [
        {
          name: 'Uncategory',
          children: [],
        }
      ];

      for (let file of files) {
        const meta = await FileDC.get(file);
        const { album } = meta;

        const newISong: ISong = {
          ...meta,
          path: file,
          title: meta?.title || file.split('\\').pop(),
        }

        if (album) {
          const exact = abs.filter((a) => a.name === album);
          if (exact.length) {
            exact[0].children.push(newISong);
          } else {
            abs.push({name: album, children: [newISong]});
          }
        } else {
          abs[0].children.push(newISong);
        }
      }

      setAlbums(abs);
    })();
  }, [])

  return (
    <MyLib className="component-library">
      <div className="header">
        <h1>Library</h1>
      </div>
      <div className="albums">
        {albums.length ? (
          albums.map((album) => {
            if (album.children.length < 1) return;

            const src = album.children[0].picture || defaultCover;

            return (
              <div
                className="album"
                key={album.name}
                onClick={(e) => handleOpenAlbum(e, album)}
              >
                <img src={`data:image/png;base64,${src}`} alt={album.name} />
                <div className="info">
                  <div className="name">{album.name}</div>
                  <div className="artist">{album.children[0].artist}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="open-dir">
            <button>添加歌曲</button>
          </div>
        )}
      </div>
      {album && (
        <div className="album-view">
          <div className="album-close">
            <div
              className="close-button"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAlbum(null);
              }}
            >
              X
            </div>
          </div>
          <div className="album-children">
            {album.children.map((c, index) => (
              <div className="album-child" key={c.title}>
                <div className="title">
                  <div className="title-order">{index + 1 + "."}</div>
                  <div className="title-text">{c.title}</div>
                </div>
                <div
                  className="operator"
                  title="添加到播放列表"
                  onClick={(e) => handleISong(e, c)}
                >
                  <span>+</span>
                </div>
              </div>
            ))}
          </div>
          <div className="album-infos">
            <div className="name">{album.name}</div>
            <div className="cover">
              <img
                src={`data:image/png;base64,${album.children[0].picture}`}
                alt={album.name}
              />
            </div>
            <div className="count">{album.children.length} 首歌曲</div>
            <div className="date">
              <span>发行时间</span> {album.children[0].date}
            </div>
            <div className="artists">
              <span>艺术家</span> {album.children[0].artist}
            </div>
            <div className="path" title={album.children[0].path}>
              <span>专辑路径</span> {album.children[0].path}
            </div>
          </div>
        </div>
      )}
    </MyLib>
  );
}

export default Library;
