import React, { createContext, useEffect, useRef, useState } from 'react';

import { Track } from '../api';

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
});

export type PageName = 'playing' | 'setting';

export default function PlayContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentRef = useRef<Track | null>(null);

  const [trackList, setTrackList] = useState<Track[]>([]);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [current, setCurrent] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(1);

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
    setIsPlaying((prev) => true);
    setCurrent(newTrack);
    currentRef.current = newTrack;
    currentRef.current.howl?.play();
  };

  const createNewSound = (src: string, volume = 0.8) => {
    return new Howl({
      src: ['audio:///' + src],
      format: ['flac', 'mp3'],
      // 设置为 true 时，音频无法从记忆的暂停点恢复
      // 因为传输方式为 stream，只传播了一部分
      html5: false,
      autoplay: true,
      volume: volume,
      onplay: () => {},
      onload: () => {},
      onend: () => next(),
      onpause: () => {},
      onstop: () => {},
    });
  };

  const next = () => {
    console.log('click next track');
  };

  const prev = () => {
    console.log('click prev track');
  };

  const isInPlaylist = (uid: string) => {
    return indexOfTracks(playlist, { uid }) >= 0;
  };

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
