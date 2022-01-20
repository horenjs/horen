/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-20 23:05:39
 * @LastEditTime : 2022-01-21 00:51:37
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen-plugin-player\index.ts
 * @Description  : a player for AlO
 */
import { Howl, Howler } from 'howler';
import AbstractPlayer from '../../abstract/plugins/player';

// 判断是否为浏览器环境
if (typeof window === 'undefined')
  throw new Error(
    `Howl Player can only run on the browser, not NodeJs Runtime.`
  );

export interface Track {
  id: number,
  src?: string,
  title?: string,
  artist?: string,
  artistList?: string[],
  album?: string,
}

/**
 * A Player powered by Howl
 * NOTION: Howl cannot be using on NodeJs Runtime.
 * You can only call it on the Browser Environment.
 */
export default class HowlPlayer extends AbstractPlayer {
  protected _trackList: Track[] = [];
  protected _currentTrack: Track = { id: 1234 };
  protected _howler?: Howl;
  // player status
  protected _playing = false;
  protected _progress = 0;
  protected _enabled = false;
  protected _volume = 1;
  protected _mode: "repeat" | "single" | "shuffle" = "repeat";

  constructor() {
    super();
  }

  public set trackList(list: Track[]) {
    this._trackList = list;

    const firstToPlay = this._trackList[0];

    this._playAudioSource(firstToPlay.src!);
  }

  public set playing(playing: boolean) {
    this._playing = playing;
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
      
  }

  public playOrPause(): void {
    
  }

  protected _playAudioSource(src: string, autoplay = true) {
    Howler.unload();

    this._howler = new Howl({
      src: [src],
      format: ["flac", "mp3"],
    });

    if (autoplay) {
      this.play();
    }
  }
}
