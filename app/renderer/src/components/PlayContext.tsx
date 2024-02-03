import React, { createContext, useEffect, useRef, useState } from 'react';

import { Track, readDB, writeDB } from '../api';
import { randomInt } from '../utils';

interface IHorenContext {
  trackList: Track[];
  setToTrackList: (tracks: Track[]) => void;
  addToTrackList: (tracks: Track[]) => void;
  playlist: Track[];
  addToPlaylist: (uids: string[]) => void;
  removeFromPlaylist: (uids: string[]) => void;
  playOrPause: (uid: string) => void;
  current: Track | null;
  isInPlaylist: (uid: string) => boolean;
  isPlaying: boolean;
  seek: number;
  duration: number;
  next: () => void;
  prev: () => void;
}

export const HorenContext = createContext<IHorenContext>({
  trackList: [],
  setToTrackList: () => null,
  addToTrackList: () => null,
  playlist: [],
  addToPlaylist: () => null,
  removeFromPlaylist: () => null,
  playOrPause: () => null,
  current: null,
  isInPlaylist: () => false,
  isPlaying: false,
  seek: 0,
  duration: 1,
  next: () => null,
  prev: () => null,
});

export type PageName = 'playing' | 'setting';

export default function PlayContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentRef = useRef<Track | null>(null);
  const endSignalRef = useRef(0);

  const [trackList, setTrackList] = useState<Track[]>([]);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [current, setCurrent] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(1);
  const [endSignal, setEndSignal] = useState(0);
  const [playMode, setPlayMode] = useState('random');

  const writePlaylistToDB = (lists: Track[]) => {
    writeDB('playlist', lists).then();
  };

  const addToTrackList = (tracks: Track[]) => {
    const newTracks: Track[] = [];
    for (const track of tracks) {
      if (indexOfTracks(trackList, track) < 0) {
        newTracks.push(track);
      }
    }
    setTrackList((prev) => [...prev, ...newTracks]);
  };

  const addToPlaylist = (uids: string[]) => {
    const newPlaylist: Track[] = [];
    for (const uid of uids) {
      if (indexOfTracks(playlist, { uid }) < 0) {
        newPlaylist.push(trackList[indexOfTracks(trackList, { uid })]);
      }
    }
    writePlaylistToDB([...playlist, ...newPlaylist]);
    setPlaylist((prev) => [...prev, ...newPlaylist]);
  };

  const removeFromPlaylist = (uids: string[]) => {
    console.log('remove a track from playlist: ', uids);
    for (const uid of uids) {
      setPlaylist((prev) => prev.filter((p) => p.uid !== uid));
    }
  };

  /**
   * 播放指定 track
   * @param track Track
   */
  const playOrPause = (uid: string) => {
    console.log('click play');

    // 如果提供的 uid 是当前歌曲则判断是否暂停或继续播放
    if (uid === currentRef.current?.uid) {
      if (currentRef.current?.howl?.playing()) {
        console.log('playing, pause it.');
        const track = currentRef.current;
        track?.howl?.pause();
        console.log('pause seek: ', track.howl?.seek());
        setIsPlaying((prev) => false);
        currentRef.current = track;
      } else {
        console.log('pasued, resume to play it.');
        console.log('resume from seek: ', currentRef.current?.howl?.seek());
        setIsPlaying((prev) => true);
        currentRef.current?.howl?.play();
      }
      return;
    }

    const idx = indexOfTracks(playlist, { uid });
    // 如果提供的 uid 不在播放列表内，则创建新的 Track
    if (idx < 0) {
      console.log('create a new sound from trackList and play it.');
      const track = findTrack(trackList, uid);
      // 这种情况下，应该新的 Track 放到队列首位
      writePlaylistToDB([track, ...playlist]);
      setPlaylist((prev) => [track, ...prev]);
      createNewTrackAndPlay(uid);
      return;
    } else {
      // 如果提供的 uid 在播放列表内，同样创建新的 Track
      console.log('existed in playlist, create sound and play it.');
      const track = findTrack(playlist, uid);
      createNewTrackAndPlay(uid);
      return;
    }
  };

  const createNewTrackAndPlay = (uid: string) => {
    Howler.unload();
    const track = findTrack(trackList, uid);
    const newTrack = { ...track, howl: createNewSound(track.src) };
    setIsPlaying(() => true);
    setCurrent(() => track);
    currentRef.current = newTrack;
    currentRef.current.howl?.play();
  };

  const createNewSound = (src: string, volume = 0.8) => {
    const sound = new Howl({
      src: ['audio:///' + src],
      format: ['flac', 'mp3'],
      // 设置为 true 时，音频无法从记忆的暂停点恢复
      // 因为传输方式为 stream，只传播了一部分
      html5: false,
      autoplay: true,
      volume: volume,
      onplay: () => {},
      onload: () => {},
      onpause: () => {},
      onstop: () => {},
    });
    sound.once('end', () => {
      setEndSignal(new Date().valueOf());
    });
    return sound;
  };

  const next = () => {
    console.log('next track');
    const idx = indexOfTracks(playlist, { uid: current?.uid || '' });
    const len = playlist.length;
    let nextIdx = idx + 1;

    if (playMode === 'loop') {
      if (nextIdx > len - 1) {
        nextIdx = 0;
      }
    }

    if (playMode === 'repeat') {
      nextIdx = idx;
    }

    if (playMode === 'in-turn') {
      if (nextIdx > len - 1) {
        Howler.unload();
      }
    }

    if (playMode === 'random') {
      nextIdx = randomInt(0, len);
    }

    const next = playlist[nextIdx];
    createNewTrackAndPlay(next.uid);
  };

  const prev = () => {
    console.log('click prev track');
    const idx = indexOfTracks(playlist, { uid: current?.uid || '' });
    const len = playlist.length;
    let prevIdx = idx - 1;

    if (playMode === 'loop') {
      if (prevIdx < 0) {
        prevIdx = len - 1;
      }
    }

    if (playMode === 'repeat') {
      prevIdx = idx;
    }

    if (playMode === 'in-turn') {
      if (prevIdx < 0) {
        Howler.unload();
      }
    }

    if (playMode === 'random') {
      prevIdx = randomInt(0, len);
    }

    const prev = playlist[prevIdx];
    createNewTrackAndPlay(prev.uid);
  };

  const isInPlaylist = (uid: string) => {
    return indexOfTracks(playlist, { uid }) >= 0;
  };

  if (endSignal !== endSignalRef.current) {
    endSignalRef.current = endSignal;
    next();
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentRef.current?.howl) {
        setSeek(currentRef.current?.howl.seek());
        // console.log(currentRef.current?.howl.seek());
      }
    }, 500);
    return () => clearInterval(timer);
  }, [currentRef.current]);

  useEffect(() => {
    setDuration(currentRef?.current?.duration || 1);
  }, [currentRef.current]);

  useEffect(() => {
    readDB('playlist').then((tracks) => {
      const finals = tracks.filter(
        (track: Track | { uid: string } | null) =>
          indexOfTracks(trackList, track) > -1
      );
      setPlaylist(finals);
    });
  }, [trackList]);

  return (
    <HorenContext.Provider
      value={{
        trackList,
        addToTrackList,
        setToTrackList: setTrackList,
        playlist,
        addToPlaylist,
        removeFromPlaylist,
        playOrPause,
        current,
        isInPlaylist,
        isPlaying,
        seek,
        duration,
        next,
        prev,
      }}
    >
      {children}
    </HorenContext.Provider>
  );
}

export const indexOfTracks = (
  tracks: Track[],
  track: Track | null | { uid: string }
) => {
  if (!track) return -1;

  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].uid === track.uid) return i;
  }

  return -1;
};

export const findTrack = (tracks: Track[], uid: string) => {
  const idx = indexOfTracks(tracks, { uid });
  return tracks[idx];
};
