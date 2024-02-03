import { Howl, Howler } from 'howler';
import { randomInt } from './index';
import _ from 'underscore';

// 判断是否为浏览器环境
if (typeof window === 'undefined')
  throw new Error(
    `Howl Player can only run on the browser, not NodeJs Runtime.`
  );

export interface HowlTrack {
  src: string;
  uid: string;
  howl?: Howl;
}

export type PlayerOrder = 'order' | 'repeat' | 'loop' | 'shuffle';

/**
 * A Player powered by Howl
 * NOTION: Howl cannot be using on NodeJs Runtime.
 * You can only call it on the Browser Environment.
 */
export default class HowlPlayer<T extends HowlTrack> {
  protected _playlist: T[];
  protected _index = 0;
  protected _volume = 0.8;
  protected _id = 0;

  constructor(playlist?: T[]) {
    this._playlist = playlist || [];
  }

  get current() {
    return this._playlist[this._index];
  }

  get playlist() {
    return this._playlist;
  }

  get native() {
    return this._playlist[this._index].howl;
  }

  public add(playlist: T[]) {
    for (const pls of playlist) {
      if (!this._playlist.includes(pls)) {
        this._playlist = [...this._playlist, pls];
      }
    }
  }

  public remove(tracks: T[]) {
    for (const track of tracks) {
      this._playlist = this._playlist.filter((p) => {
        if (p.uid === track.uid) p.howl?.stop();
        return p.uid !== track.uid;
      });
    }
  }

  public play(index = this._index) {
    this.playlist.forEach((p) => {
      p.howl?.stop();
    });

    let sound;
    const data = this._playlist[index];
    if (!data) return;

    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: ['audio:///' + data.src],
        format: ['flac', 'mp3'],
        html5: true,
        autoplay: true,
        volume: this._volume,
        onplay: () => {},
        onload: () => {},
        onend: () => {
          this.skip('next');
        },
        onpause: () => {},
        onstop: () => {},
        onseek: () => {},
      });
    }

    this._id = sound.play();
    this._index = index;
  }

  public pause() {
    const sound = this._playlist[this._index].howl;
    sound?.pause();
  }

  public skip(str: string) {
    if (str === 'next') {
      this._playlist[this._index].howl?.stop();
      this._index += 1;
      this.play(this._index);
    }
  }

  public volume(val: number) {
    Howler.volume(val);
  }

  public seek(per?: number) {
    if (per === undefined) {
      return this._playlist[this._index]?.howl?.seek();
    }

    const sound = this._playlist[this._index].howl;
    if (sound?.playing(this._id)) {
      console.log(sound.duration() * per, this._id);
      sound.seek(sound.duration() * per, this._id);
    }
  }

  public step() {
    const sound = this._playlist[this._index].howl;
    const seek = sound?.seek() || 0;
    if (sound?.playing()) {
    }
  }
}
