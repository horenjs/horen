/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-20 23:30:32
 * @LastEditTime : 2022-01-21 10:50:47
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen-plugin-player\index.test.ts
 * @Description  :
 */
import Player, { Track } from './index';

const player = new Player();

const playList: Track[] = [
  {
    id: 89089834,
    src: 'D:\\Music\\大鱼海棠\\02.腾雾奔霄.flac',
  },
  {
    id: 65979464,
    src: 'D:\\Music\\林俊杰合集\\2007 林俊杰 - 西界\\04. 西界.flac',
  },
];

player.trackList = playList;

player.play();
