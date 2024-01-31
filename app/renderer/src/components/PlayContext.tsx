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
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [playList, setPlayList] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * 播放指定 track
   * @param track Track
   */
  const play = (track?: Track) => {
    console.log('click play');
    if (track) {
      if (currentTrack && track.uid === currentTrack.uid) {
        console.log('already current track.');
        player.resume();
        setIsPlaying(true);
      } else {
        player.play(track);
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    } else {
      player.resume();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    console.log('click pause');
    player.pause();
    setIsPlaying(false);
  };

  const add = (track: Track) => {
    console.log('add a new track: ', track.title);
    setPlayList([...playList, track]);
    player.trackList = [...playList, track];
  };

  const remove = (track: Track) => {
    console.log('remove a track: ', track.title);
    setPlayList((prev) => prev.filter((t) => t.uid !== track.uid));
    const pls = player.trackList.filter((t) => t.uid !== track.uid);
    player.trackList = pls;
  };

  const next = () => {
    console.log('click next track');
    player.skip('next');
    setCurrentTrack(player.currentTrack);
    setIsPlaying(true);
  };

  const prev = () => {
    console.log('click prev track');
    player.skip('prev');
    setCurrentTrack(player.currentTrack);
    setIsPlaying(true);
  };

  const isAdd = (track: Track) => {
    return indexOfTracks(playList, track) >= 0;
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

export const indexOfTracks = (tracks: Track[], track: Track | null) => {
  if (!track) return -1;

  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].uid === track.uid) return i;
  }

  return -1;
};
