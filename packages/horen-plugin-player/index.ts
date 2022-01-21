/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-20 23:05:39
 * @LastEditTime : 2022-01-21 17:49:16
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen-plugin-player\index.ts
 * @Description  : a player for AlO
 */
import { Howl, Howler } from 'howler';
import AbstractPlayer from './player';

// 判断是否为浏览器环境
if (typeof window === 'undefined')
  throw new Error(
    `Howl Player can only run on the browser, not NodeJs Runtime.`
  );

export interface Track {
  id: number;
  src?: string;
  title?: string;
  artist?: string;
  artistList?: string[];
  album?: string;
}

export type PlayMode = 'repeat' | 'single' | 'shuffle';

/**
 * A Player powered by Howl
 * NOTION: Howl cannot be using on NodeJs Runtime.
 * You can only call it on the Browser Environment.
 */
export default class HowlPlayer extends AbstractPlayer {
  protected _trackList: Track[] = [];
  protected _currentTrack?: Track;
  protected _howler?: Howl;
  // player status
  protected _playing = false;
  protected _progress = 0;
  protected _enabled = false;
  protected _volume = 1;
  protected _mode: PlayMode = 'repeat';

  constructor() {
    super();
  }

  public set trackList(list: Track[]) {
    this._trackList = list;

    if (this._howler) {
      // if there is a howler, do nothing      
    } else {
      const first = this._trackList[0];
      if (first.src) {
        this._playAudioSource(first.src);
        this._currentTrack = first;
      }
    }
  }

  public get trackList() {
    return this._trackList;
  }

  public get currentTrack() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._currentTrack!;
  }

  public set currentTrack(track: Track) {
    this._currentTrack = track;
  }

  public set playing(playing: boolean) {
    this._playing = playing;
  }

  public get playing() {
    return this._playing;
  }

  public get progress() {
    return this._progress;
  }

  public set progress(seek: number) {
    this._howler?.seek(seek);
  }

  public play() {
    if (this._howler?.playing()) return;

    this._howler?.play();
    this._playing = true;
  }

  public pause() {
    this._howler?.pause();
    this._playing = false;
  }

  public stop(): void {
    this._howler?.stop();
    this._playing = false;
  }

  public playOrPause(): void {
    if (this._howler) {
      if (this._howler.playing()) {
        this._howler.pause();
        this._playing = false;
      } else {
        this._howler.play();
        this._playing = true;
      }
    }
  }

  protected _playAudioSource(src: string, autoplay = true) {
    Howler.unload();

    this._howler = new Howl({
      src: [src],
      format: ['flac', 'mp3'],
      html5: true,
    });

    if (autoplay) {
      this.play();
    }
  }
}
