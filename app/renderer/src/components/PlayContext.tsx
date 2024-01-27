import React, { useState, createContext, useEffect, useRef } from 'react';
import { HowlPlayer, PlayerOrder } from '../utils';
import {
  Track,
  readAudioSource,
  readCoverSource,
  readPlaylist,
  writePlaylist,
} from '../api';

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
      readAudioSource(track.src).then((res) => {
        readCoverSource(track.album || '', track.artist || '').then((cover) => {
          player.currentTrack = { ...track, source: res, cover };
          currentTrackRef.current = { ...track, source: res, cover };
          setCurrentTrack({ ...track, source: res, cover });
        });
      });

      disPosePlaylist(track);
    }
    setIsPlaying(true);
  };

  const disPosePlaylist = (track: Track) => {
    if (!includes(playList, track)) {
      (async () => {
        const audioSource = await readAudioSource(track.src);
        const coverSource = await readCoverSource(
          track?.album || '',
          track.artist
        );
        player.trackList = [
          ...player.trackList,
          { ...track, source: audioSource, cover: coverSource },
        ];
        setPlayList((prev) => [
          ...prev,
          { ...track, source: audioSource, cover: coverSource },
        ]);
        // save play list
        await writePlaylist(
          player.trackList.map((p) => {
            p.cover = '';
            p.source = '';
            return p;
          })
        );
      })();
    }
  };

  const pause = () => {
    player.pause();
    setIsPlaying(false);
  };

  const add = (track: Track) => {
    disPosePlaylist(track);
  };

  const remove = (track: Track) => {
    setPlayList((prev) => prev.filter((t) => t.uid !== track.uid));
    const pls = player.trackList.filter((t) => t.uid !== track.uid);
    player.trackList = pls;
    writePlaylist(
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

  useEffect(() => {
    const timer = setInterval(() => {
      if (player.currentTrack?.uid !== currentTrackRef.current?.uid) {
        console.log('track changed');
        setCurrentTrack((prev) => {
          return { ...prev, ...player.currentTrack };
        });
        currentTrackRef.current = player.currentTrack;
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    readPlaylist().then((pls) => {
      if (pls && pls instanceof Array) {
        const playlist: Track[] = [];
        for (const p of pls) {
          (async () => {
            const coverSource = await readCoverSource(p.album || '');
            const sourceSource = await readAudioSource(p.src);
            playlist.push({
              ...p,
              source: sourceSource,
              cover: coverSource,
            });
          })();
        }
        setPlayList(playlist);
        player.trackList = playlist;
      }
    });
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
