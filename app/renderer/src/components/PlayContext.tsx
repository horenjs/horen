import React, { useState, createContext } from 'react';
import { HowlPlayer } from '../utils';
import { Track, getFile } from '../api';

interface IHorenContext {
  player: {
    add: (track: Track) => void;
    remove: (track: Track) => void;
    play: (track: Track) => void;
    next: () => void;
    prev: () => void;
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
  const [trackList, setTrackList] = useState<Track[]>([]);

  const play = (track: Track) => {
    console.log(trackList);
    setCurrentTrack(track);

    getFile(track.src).then((res) => {
      player.currentTrack = { ...track, src: res };
    });

    if (!includes(trackList, track)) {
      setTrackList((prev) => [...prev, track]);
    }
  };

  const add = (track: Track) => {
    if (!includes(trackList, track)) setTrackList((prev) => [...prev, track]);
  };

  const remove = (track: Track) => {
    setTrackList((prev) => prev.filter((t) => t.title !== track.title));
  };

  const next = () => {
    if (currentTrack) {
      const idx = trackList.indexOf(currentTrack);
      const length = trackList.length;
      if (idx < length - 1) {
        play(trackList[idx + 1]);
      }
    }
  };

  const prev = () => {
    if (currentTrack) {
      const idx = trackList.indexOf(currentTrack);
      if (idx > 0) {
        play(trackList[idx - 1]);
      }
    }
  };

  return (
    <HorenContext.Provider
      value={{
        player: { add, play, remove, prev, next, currentTrack, trackList },
      }}
    >
      {children}
    </HorenContext.Provider>
  );
}

export const includes = (tracks: Track[], track: Track) => {
  for (const t of tracks) {
    if (t.title === track.title) return true;
  }
};
