/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 00:29:58
 * @LastEditTime : 2022-01-21 09:26:59
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \alo\abstract\plugins\player.ts
 * @Description  :
 */
import { Howl } from 'howler';

export interface Track {
  id: number;
  src?: string;
  title?: string;
  artist?: string;
  artistList?: string[];
  album?: string;
}

/**
 * Horen Plugin Abstract Class - Player
 * must implenments the abs class.
 */
export default abstract class Player {
  protected _trackList: Track[] = [];
  protected _currentTrack: Track = { id: 1234 };
  protected _howler?: Howl;
  // player status
  protected _playing = false;
  protected _progress = 0;
  protected _enabled = false;
  protected _volume = 1;
  protected _mode: 'repeat' | 'single' | 'shuffle' = 'repeat';

  /**
   * 设置播放列表
   */
  public abstract set trackList(list: Track[]);

  /**
   * 设置播放状态
   */
  public abstract set playing(playing: boolean);

  /**
   * 播放歌曲
   */
  public abstract play(): void;

  /**
   * 暂停播放
   */
  public abstract pause(): void;

  /**
   * 停止播放
   */
  public abstract stop(): void;

  /**
   * 播放或停止
   */
  public abstract playOrPause(): void;

  /**
   * 从音源播放歌曲
   * @param src 歌曲源，可以是网址或本地文件地址
   * @param autoplay 是否自动播放
   */
  protected abstract _playAudioSource(src: string, autoplay: boolean): void;
}
