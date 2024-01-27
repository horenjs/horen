import React, { useState, createContext } from 'react';
import { HowlPlayer, PlayerOrder } from '../utils';
import { Track, readAudioSource, readCoverSource } from '../api';

interface IHorenContext {
  player: {
    add: (track: Track) => void;
    remove: (track: Track) => void;
    play: (track: Track) => void;
    next: () => void;
    prev: () => void;
    isAdd: (track: Track) => boolean;
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
    next: () => {},
    prev: () => {},
    isAdd: () => false,
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
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playList, setPlayList] = useState<Track[]>([]);
  const [trackList, setTrackList] = useState<Track[]>([]);

  const play = (track: Track) => {
    readAudioSource(track.src).then((res) => {
      readCoverSource(track.src).then((cover) => {
        player.currentTrack = { ...track, src: res, cover };
        setCurrentTrack({ ...track, src: res, cover });
      });
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
      const idx = () => {
        let i = 0;
        for (const t of playList) {
          if (t.uid === currentTrack.uid) return i;
          i += 1;
        }
        return 1;
      };
      const length = playList.length;
      if (idx() < length - 1) {
        play(playList[idx() + 1]);
      }
    }
  };

  const prev = () => {
    if (currentTrack) {
      const idx = () => {
        let i = 0;
        for (const t of playList) {
          if (t.uid === currentTrack.uid) return i;
          i += 1;
        }
        return 1;
      };
      if (idx() > 0) {
        play(playList[idx() - 1]);
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
