/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-17 22:07:21
 * @LastEditTime : 2022-01-20 17:38:40
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \alo\src\main\player.ts
 * @Description  : 
 */
import fs from 'fs';
import Speaker from 'speaker';
const lame = require('@suldashi/lame');

type Status =
  | "to-load"
  | "loading"
  | "loaded"
  | "unloaded"
  | "to-pause"
  | "paused"
  | "to-play"
  | "playing"
  | "end"
  | "to-stop"
  | "stop";

export default class Player {
  /**
   * 文件读流
   */
  protected rs: fs.ReadStream;
  /**
   * 从什么位置读取
   * 可以用于 seek
   */
  protected start = 0;
  /**
   * 每次读取的尺寸
   * 对于 320kbs 的音乐来说
   * 每次读取的值应当在 4 ~ 320 之间
   */
  protected chunkSize = 4 * 1024;
  /**
   * 播放状态
   */
  protected status: Status = 'to-load';

  constructor(protected src: string) {
    // 生成对象时创建读流
    this.rs = fs.createReadStream(src, {
      start: this.start,
      highWaterMark: this.chunkSize,
    });

    // 创建一个值用于保存播放位置
    let length = 0;
    // 监听 data，将会自动将独读流设置为 flowing
    this.rs.on('data', data => {
      if (this.status === "to-pause") {
        this.start = length * this.chunkSize;
        // todo: 暂停流会延迟 暂时不知道原因
        // http://nodejs.cn/api/stream.html#two-reading-modes
        // 此外，如果有管道目标，则调用 stream.pause() 
        // 将不能保证一旦这些目标排空并要求更多数据，流将保持暂停状态。
        // Also, if there are piped destinations, then calling stream.pause() 
        // will not guarantee that the stream will remain paused once those 
        // destinations drain and ask for more data.
        this.rs.pause();
        console.log("do pause", new Date());
      }

      if (this.status === 'to-stop') {
        this.start = 0;
        this.rs.destroy();
        console.log('do stop', new Date());
      }

      // 每读一次就将长度加 1
      length += 1;
    })
  }

  play() {
    this.rs.pipe(new lame.Decoder()).pipe(new Speaker());
    this.status = "playing";
  }

  pause() {
    console.log('to pause', new Date());
    this.status = 'to-pause';
    // 监听 pause 事件
    this.rs.on("pause", this.readableCb);
  }

  resume() {
    console.log('to resume', new Date())
    this.status = 'to-play';

    // 恢复播放时移除监听器
    this.rs.removeListener("pause", this.readableCb);

    this.rs.resume();
  }

  stop() {
    console.log('to stop', new Date());
    this.status = 'to-stop';
  }

  readableCb() {
    if (this.rs && this.rs.isPaused()) {
      console.log("is paused.", new Date());
      this.status = "paused";
    }
  }
}
