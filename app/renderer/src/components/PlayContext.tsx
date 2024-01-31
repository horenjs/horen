import React, { useState, createContext, useEffect, useRef } from 'react';
import { HowlPlayer, PlayerOrder } from '../utils';
import { Track, readDB, writeDB } from '../api';

interface IHorenContext {
  player: {
    add: (track: Track) => void;
    remove: (track: Track) => void;
    play: (track?: Track) => void;
    pause: () => void;
    next: () => void;
    prev: () => void;
    isAdd: (track: Track) => boolean;
    isPlaying: boolean;
    playList: Track[];
    currentTrack: Track | null;
    native: HowlPlayer<Track> | null;
  };
  trackList: {
    value: Track[];
    set: (trackList: Track[]) => void;
  };
}

const player = new HowlPlayer<Track>();

export const HorenContext = createContext<IHorenContext>({
  player: {
    add: () => {},
    remove: () => {},
    play: () => {},
    pause: () => {},
    next: () => {},
    prev: () => {},
    isAdd: () => false,
    isPlaying: false,
    playList: [],
    currentTrack: null,
    native: null,
  },
  trackList: {
    value: [],
    set: () => {},
  },
});

export type PageName = 'playing' | 'setting';

export default function PlayContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentTrackRef = useRef<Track | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playList, setPlayList] = useState<Track[]>([]);
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (track?: Track) => {
    if (!track || (currentTrack && track.uid === currentTrack.uid)) {
      player.playOrPause();
    } else {
      player.currentTrack = track;
      setCurrentTrack(track);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    player.pause();
    setIsPlaying(false);
  };

  const add = (track: Track) => {
    player.trackList = [...player.trackList, track];
    setPlayList((prev) => [...prev, track]);
  };

  const remove = (track: Track) => {
    setPlayList((prev) => prev.filter((t) => t.uid !== track.uid));
    const pls = player.trackList.filter((t) => t.uid !== track.uid);
    player.trackList = pls;
    writeDB(
      'playlist',
      pls.map((p) => {
        p.cover = '';
        p.source = '';
        return p;
      })
    ).then();
  };

  const next = () => {
    player.skip('next');
  };

  const prev = () => {
    player.skip('prev');
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
          pause,
          remove,
          prev,
          next,
          isAdd,
          isPlaying,
          currentTrack,
          playList,
          native: player,
        },
        trackList: {
          value: trackList,
          set: setTrackList,
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
