import React, { useState, createContext } from 'react';
import { HowlPlayer, PlayerOrder } from '../utils';
import { Track, getFile } from '../api';

interface IHorenContext {
  player: {
    add: (track: Track) => void;
    remove: (track: Track) => void;
    play: (track: Track) => void;
    next: () => void;
    prev: () => void;
    isAdd: (track: Track) => boolean;
    trackList: Track[];
    currentTrack: Track | null;
  };
}

const player = new HowlPlayer<Track>();

export const HorenContext = createContext<IHorenContext>({
  player: {
    add: () => {},
    remove: () => {},
    play: () => {},
    next: () => {},
    prev: () => {},
    isAdd: () => false,
    trackList: [],
    currentTrack: null,
  },
});

export type PageName = 'playing' | 'setting';

export default function PlayContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playList, setPlayList] = useState<Track[]>([]);

  const play = (track: Track) => {
    setCurrentTrack(track);

    getFile(track.src).then((res) => {
      player.currentTrack = { ...track, src: res };
    });

    if (!includes(playList, track)) {
      setPlayList((prev) => [...prev, track]);
    }
  };

  const add = (track: Track) => {
    if (!includes(playList, track)) setPlayList((prev) => [...prev, track]);
  };

  const remove = (track: Track) => {
    setPlayList((prev) => prev.filter((t) => t.uid !== track.uid));
  };

  const next = () => {
    if (currentTrack) {
      const idx = playList.indexOf(currentTrack);
      const length = playList.length;
      if (idx < length - 1) {
        play(playList[idx + 1]);
      }
    }
  };

  const prev = () => {
    if (currentTrack) {
      const idx = playList.indexOf(currentTrack);
      if (idx > 0) {
        play(playList[idx - 1]);
      }
    }
  };

  const isAdd = (track: Track) => {
    return includes(playList, track);
  };

  return (
    <HorenContext.Provider
      value={{
        player: {
          add,
          play,
          remove,
          prev,
          next,
          isAdd,
          currentTrack,
          trackList: playList,
        },
      }}
    >
      {children}
    </HorenContext.Provider>
  );
}

export const includes = (tracks: Track[], track: Track) => {
  for (const t of tracks) {
    if (t.uid === track.uid) return true;
  }
  return false;
};
