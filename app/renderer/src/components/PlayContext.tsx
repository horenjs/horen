import React, { createContext, useEffect, useState } from 'react';

import { Track } from '../api';
import { HowlPlayer } from '../utils';

interface IHorenContext {
  player: {
    add: (track: Track) => void;
    remove: (track: Track) => void;
    play: (track?: Track) => void;
    pause: () => void;
    next: () => void;
    prev: () => void;
    seekTo: (seek: number) => void;
    isAdd: (track: Track) => boolean;
    isPlaying: boolean;
    playList: Track[];
    currentTrack: Track | null;
    duration: number;
    seek: number;
  };
  trackList: {
    value: Track[];
    set: (trackList: Track[]) => void;
  };
}

const howlPlayer = new HowlPlayer<Track>();

export const HorenContext = createContext<IHorenContext>({
  player: {
    add: () => {},
    remove: () => {},
    play: () => {},
    pause: () => {},
    next: () => {},
    prev: () => {},
    seekTo: () => {},
    isAdd: () => false,
    isPlaying: false,
    playList: [],
    currentTrack: null,
    duration: 1,
    seek: 0,
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
  const [duration, setDuration] = useState(1);
  const [seek, setSeek] = useState(0);

  /**
   * 播放指定 track
   * @param track Track
   */
  const play = (track?: Track) => {
    console.log('click play');
    if (!track) {
    } else {
      howlPlayer.add([track]);
      howlPlayer.play(howlPlayer.playlist.indexOf(track));
    }
  };

  const pause = () => {
    console.log('click pause');
    howlPlayer.pause();
  };

  const add = (track: Track) => {
    console.log('add a new track: ', track.title);
    howlPlayer.add([track]);
  };

  const remove = (track: Track) => {
    console.log('remove a track: ', track.title);
    howlPlayer.remove([track]);
  };

  const next = () => {
    console.log('click next track');
    howlPlayer.skip('next');
  };

  const prev = () => {
    console.log('click prev track');
    howlPlayer.skip('prev');
  };

  const isAdd = (track: Track) => {
    return indexOfTracks(playList, track) >= 0;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTrack(howlPlayer.current);
      setPlayList(howlPlayer.playlist);
      setIsPlaying(howlPlayer.current?.howl?.playing() || false);
      setSeek(howlPlayer.current?.howl?.seek() || 0);
      setDuration(howlPlayer.current?.howl?.duration() || 1);
    }, 32);
    return () => clearInterval(timer);
  }, []);

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
          seekTo: (per: number) => howlPlayer.seek(per),
          isAdd,
          isPlaying,
          currentTrack,
          playList,
          duration,
          seek,
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
