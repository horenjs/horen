/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-20 23:05:39
 * @LastEditTime : 2022-01-23 20:05:22
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen-plugin-player\index.ts
 * @Description  : a player for AlO
 */
import { Howl, Howler } from 'howler';
import { randomInt, shift } from 'horen-util';
import _ from 'underscore';

// 判断是否为浏览器环境
if (typeof window === 'undefined')
  throw new Error(
    `Howl Player can only run on the browser, not NodeJs Runtime.`
  );

export interface Track {
  id?: number;
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
export default class HowlPlayer {
  /**
   * track list
   */
  protected _trackList: Track[] = [];
  /**
   * max history list length
   */
  protected _maxHistoryListLength = 10;
  /**
   * track history list
   */
  protected _historyList: Track[] = [];
  /**
   * the track is loaded currently
   */
  protected _currentTrack?: Track;
  /**
   * howler player
   */
  protected _howler?: Howl;
  /**
   * is the track playing
   */
  protected _playing = false;
  /**
   * seek the position of the track
   */
  protected _seek = 0;
  /**
   * duration shouldn't be ZERO
   */
  protected _duration = 1;
  /**
   * is player enabled
   */
  protected _enabled = false;
  /**
   * volume of the track, 1 ~ 100
   */
  protected _volume = 30;
  /**
   * play mode
   */
  protected _mode: PlayMode = 'repeat';

  public set trackList(list: Track[]) {
    // 歌曲不允许重复
    const uniqueArr = list.reduce((prev, curr) => {
      if (prev.length === 0) return [curr];
      // 深比较是否相等
      // 防止切换路由后 Track 对象重新生成
      // new Set() 认为对象总是不相等
      else return includesDeep(prev, curr) ? prev : [...prev, curr];
    }, [] as Track[]);

    this._trackList = uniqueArr;

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

  /**
   * get the track list
   */
  public get trackList() {
    return this._trackList;
  }

  /**
   * get the history list
   */
  public get historyList() {
    return this._historyList;
  }

  /**
   * set the history list
   */
  public set historyList(l: Track[]) {
    this._historyList = l;
  }

  /**
   * get the current track
   */
  public get currentTrack() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._currentTrack!;
  }

  /**
   * set the current track
   */
  public set currentTrack(track: Track) {
    this._currentTrack = track;
    if (track?.src) this._playAudioSource(track.src);
  }

  /**
   * set the play status
   */
  public set playing(playing: boolean) {
    this._playing = playing;
  }

  /**
   * get the play status
   */
  public get playing() {
    this._playing = Boolean(this._howler?.playing());
    return this._playing;
  }

  /**
   * get the seek of track
   */
  public get seek() {
    this._seek = this._howler?.seek() || 0;
    return this._seek;
  }

  /**
   * set the seek of track
   */
  public set seek(s: number) {
    this._howler?.seek(s);
  }

  /**
   * get the duration of track
   */
  public get duration() {
    this._duration = this._howler?.duration() || 0;
    return this._duration;
  }

  /**
   * get the play mode of the track list
   */
  public get mode() {
    return this._mode;
  }

  /**
   * set the play mode of the track list
   */
  public set mode(m: PlayMode) {
    this._mode = m;
  }

  // There are many methods below to operate the TRACK.
  //
  //
  /**
   * play the track, just for inner operation.
   * if you want to play a track specific
   * use [set currentTrack()]
   * @returns null
   */
  protected _play() {
    if (this._howler?.playing()) return;

    this._howler?.play();

    // when play a new track, record it by push to HISTORY_LIST
    if (this.currentTrack) {
      this.historyList = this.historyList.concat(this.currentTrack);
      // oversize, shift the first one;
      if (this.historyList.length > this._maxHistoryListLength) {
        this.historyList = shift(this.historyList);
      }
    }

    this._howler?.once('end', () => this.skip('next'));
  }

  /**
   * pause the track
   */
  public pause() {
    this._howler?.pause();
  }

  /**
   * stop the track
   */
  public stop(): void {
    this._howler?.stop();
  }

  /**
   * skip the track in some order
   * prev - the previous track
   * next - the next track
   * if the _mode is shuffle, you cannot know the which track is the next.
   * @param order : which order the track skips to;
   */
  public skip(order: 'prev' | 'next') {
    if (!this.currentTrack || !this.trackList.length) return;

    const index = this.trackList.indexOf(this.currentTrack);

    this._skipTo(order, index, this.trackList.length);
  }

  protected _skipTo(order: 'prev' | 'next', index: number, length: number) {
    switch (this.mode) {
      case 'repeat':
        if (order === 'next') {
          if (index >= length - 1) this.currentTrack = this.trackList[0];
          else this.currentTrack = this.trackList[index + 1];
        } else {
          if (index < 1) this.currentTrack = this.trackList[length - 1];
          else this.currentTrack = this.trackList[index - 1];
        }
        break;
      case 'single':
        this.currentTrack = this.trackList[index];
        break;
      case 'shuffle': {
        // todo: momerize the tracks passed.
        const i = randomInt(0, length - 1);
        // 如果随机到的数与当前正在播放的相差在 1 位以内
        // 则重新进行随机以制造出伪随机的效果
        if (Math.abs(i - index) < 2) this._skipTo(order, index, length);
        else this.currentTrack = this.trackList[i];
        break;
      }
    }
  }

  /**
   * if track is playing, pause it
   * if track is paused, resume its status to playing
   */
  public playOrPause(): void {
    if (this._howler?.playing()) this._howler.pause();
    else this._play();
  }

  /**
   * play the audio from source given
   * @param src : src of track;
   * @param autoplay if auto play after load the track
   */
  protected _playAudioSource(src: string, autoplay = true) {
    Howler.unload();

    this._howler = new Howl({
      src: [src],
      format: ['flac', 'mp3'],
      html5: true,
    });

    if (autoplay) {
      this._play();
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function includesDeep(arr: any[], obj: object) {
  const filtered = arr.filter((value) => _.isEqual(value, obj));
  if (filtered.length > 0) return true;
  else return false;
}
