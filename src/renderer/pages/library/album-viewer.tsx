/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 12:50:22
 * @LastEditTime : 2022-01-30 00:28:21
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\pages\library\album-viewer.tsx
 * @Description  :
 */
import React from 'react';
import defaultCover from '@/static/image/default-cover';
import {Album} from "types";
import { findTitleFromKey, findArtistFromKey } from "@/pages/library/index";
import { TrackDC} from "@/data-center";

interface Props {
  album: Album;
  onOpen(a: Album): void;
}

export function AlbumView(props: Props) {
  const { album, onOpen } = props;

  const [src, setSrc] = React.useState(defaultCover);

  const handleOpen = async (e: React.MouseEvent<HTMLDivElement>, a: Album) => {
    e.preventDefault();
    e.stopPropagation();
    await onOpen(a);
  };

  React.useEffect(() => {
    (async () => {
      const res = await TrackDC.getAlbumCover(album.key);
      if (typeof res !== "undefined") setSrc(res);
    })();
  }, []);

  return (
    <div
      className="album electron-no-drag"
      data-album-key={album.key}
      onClick={async (e) => await handleOpen(e, album)}
    >
      <img src={`data:image/png;base64,${src}`} alt={album.key} />
      <div className="info">
        <div className="name">{findTitleFromKey(album.key)}</div>
        <div className="artist">{findArtistFromKey(album.key)}</div>
      </div>
    </div>
  );
}
